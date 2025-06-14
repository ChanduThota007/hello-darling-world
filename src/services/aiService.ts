
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

interface AnthropicResponse {
  content: Array<{
    text: string;
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

export class AIService {
  private apiKey: string | null = null;
  private provider: string = 'openai'; // Default to OpenAI
  private model: string = 'gpt-3.5-turbo';

  setProvider(providerId: string, model?: string) {
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
    localStorage.setItem('nova-ai-provider', providerId);
    localStorage.setItem('nova-ai-model', this.model);
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem(`nova-${this.provider}-key`, key);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem(`nova-${this.provider}-key`);
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
      return 'https://api.openai.com/v1/chat/completions';
    }

    // Special handling for Google Gemini
    if (this.provider === 'google') {
      return `${provider.endpoint}/${this.model}:generateContent`;
    }

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

  private async callAnthropicAPI(messages: Message[]): Promise<string> {
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch(this.getApiEndpoint(), {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1000,
        system: systemMessage?.content,
        messages: conversationMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data: AnthropicResponse = await response.json();
    return data.content[0]?.text || 'Sorry, I couldn\'t generate a response.';
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
        case 'anthropic':
          return await this.callAnthropicAPI(formattedMessages);
        case 'google':
          return await this.callGoogleAPI(formattedMessages);
        case 'openai':
        case 'groq':
        case 'mistral':
        default:
          return await this.callOpenAICompatibleAPI(formattedMessages);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
