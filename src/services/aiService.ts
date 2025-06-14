import { AI_PROVIDERS, AIProvider } from './aiProviders';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

export class AIService {
  private apiKey: string | null = null;
  private provider: string = 'groq'; // Default to Groq (free)
  private model: string = 'llama-3.1-70b-versatile';

  constructor() {
    // Load saved settings on initialization
    this.loadSavedSettings();
  }

  private loadSavedSettings() {
    // Load saved provider and model
    const savedProvider = localStorage.getItem('nova-ai-provider');
    const savedModel = localStorage.getItem('nova-ai-model');
    
    if (savedProvider) {
      this.provider = savedProvider;
    }
    
    if (savedModel) {
      this.model = savedModel;
    } else {
      // Set default model for current provider
      const provider = AI_PROVIDERS.find(p => p.id === this.provider);
      if (provider && provider.models.length > 0) {
        this.model = provider.models[0];
      }
    }

    // Load saved API key for current provider
    this.apiKey = localStorage.getItem(`nova-${this.provider}-key`);
    
    console.log('Loaded settings:', {
      provider: this.provider,
      model: this.model,
      hasApiKey: !!this.apiKey
    });
  }

  setProvider(providerId: string, model?: string) {
    console.log('Setting provider:', providerId, 'with model:', model);
    
    this.provider = providerId;
    if (model) {
      this.model = model;
    } else {
      // Set default model for provider
      const provider = AI_PROVIDERS.find(p => p.id === providerId);
      if (provider && provider.models.length > 0) {
        this.model = provider.models[0];
      }
    }
    
    // Save provider and model settings
    localStorage.setItem('nova-ai-provider', providerId);
    localStorage.setItem('nova-ai-model', this.model);
    
    // Load existing API key for this provider
    this.apiKey = localStorage.getItem(`nova-${this.provider}-key`);
    
    console.log('Provider set. API key available:', !!this.apiKey);
  }

  setApiKey(key: string) {
    console.log('Setting API key for provider:', this.provider);
    this.apiKey = key;
    // Store API key with provider-specific key
    localStorage.setItem(`nova-${this.provider}-key`, key);
    console.log('API key stored for provider:', this.provider);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      // Try to load from localStorage
      this.apiKey = localStorage.getItem(`nova-${this.provider}-key`);
      console.log('Loaded API key from storage for provider:', this.provider, 'Found:', !!this.apiKey);
    }
    return this.apiKey;
  }

  getProvider(): AIProvider | null {
    return AI_PROVIDERS.find(p => p.id === this.provider) || null;
  }

  getCurrentModel(): string {
    return this.model;
  }

  private getApiEndpoint(): string {
    const provider = this.getProvider();
    if (!provider?.endpoint) {
      return 'https://api.groq.com/openai/v1/chat/completions';
    }

    // Special handling for Google Gemini
    if (this.provider === 'google') {
      return `${provider.endpoint}/${this.model}:generateContent`;
    }

    // Special handling for Hugging Face
    if (this.provider === 'huggingface') {
      return `${provider.endpoint}/${this.model}`;
    }

    // OpenAI, Groq use the same endpoint format
    return provider.endpoint;
  }

  private async callOpenAICompatibleAPI(messages: Message[]): Promise<string> {
    const response = await fetch(this.getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
  }

  private async callGoogleAPI(messages: Message[]): Promise<string> {
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    const systemInstruction = messages.find(m => m.role === 'system');

    const response = await fetch(`${this.getApiEndpoint()}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: systemInstruction ? {
          parts: [{ text: systemInstruction.content }]
        } : undefined,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I couldn\'t generate a response.';
  }

  private async callHuggingFaceAPI(messages: Message[]): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n') + '\nassistant:';

    const response = await fetch(this.getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data: HuggingFaceResponse[] = await response.json();
    return data[0]?.generated_text?.trim() || 'Sorry, I couldn\'t generate a response.';
  }

  async generateResponse(messages: Array<{ content: string; sender: 'user' | 'nova' }>): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error(`${this.getProvider()?.name || 'AI'} API key not set`);
    }

    const formattedMessages: Message[] = [
      {
        role: 'system',
        content: `You are Nova, a personal AI assistant. You are helpful, intelligent, and friendly. 
        You assist with tasks, answer questions, and help with productivity. 
        Keep responses concise but informative. You have a slightly futuristic personality but remain professional.`
      },
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))
    ];

    try {
      switch (this.provider) {
        case 'google':
          return await this.callGoogleAPI(formattedMessages);
        case 'huggingface':
          return await this.callHuggingFaceAPI(formattedMessages);
        case 'openai':
        case 'groq':
        default:
          return await this.callOpenAICompatibleAPI(formattedMessages);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // If current provider fails, try to fallback to another free provider
      if (this.provider !== 'groq') {
        console.log('Attempting fallback to Groq...');
        const originalProvider = this.provider;
        this.setProvider('groq');
        
        try {
          const fallbackKey = this.getApiKey();
          if (fallbackKey) {
            return await this.callOpenAICompatibleAPI(formattedMessages);
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          this.setProvider(originalProvider); // Restore original provider
        }
      }
      
      throw error;
    }
  }
}

export const aiService = new AIService();
