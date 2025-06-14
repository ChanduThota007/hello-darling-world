
import { AI_PROVIDERS, AIProvider } from './aiProviders';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class AIService {
  private apiKey: string | null = null;
  private provider: string = 'groq'; // Default to free Groq
  private model: string = 'llama-3.1-8b-instant';

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
    switch (this.provider) {
      case 'groq':
        return 'https://api.groq.com/openai/v1/chat/completions';
      case 'huggingface':
        return `https://api-inference.huggingface.co/models/${this.model}`;
      case 'cohere':
        return 'https://api.cohere.ai/v1/chat';
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  private async callGroqAPI(messages: Message[]): Promise<string> {
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

    const data: AIResponse = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
  }

  private async callHuggingFaceAPI(messages: Message[]): Promise<string> {
    const lastMessage = messages[messages.length - 1].content;
    
    const response = await fetch(this.getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: lastMessage,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || 'Sorry, I couldn\'t generate a response.';
  }

  private async callCohereAPI(messages: Message[]): Promise<string> {
    const response = await fetch(this.getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        message: messages[messages.length - 1].content,
        chat_history: messages.slice(0, -1).map(msg => ({
          role: msg.role,
          message: msg.content
        })),
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.text || 'Sorry, I couldn\'t generate a response.';
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
        case 'groq':
        case 'openai':
          return await this.callGroqAPI(formattedMessages);
        case 'huggingface':
          return await this.callHuggingFaceAPI(formattedMessages);
        case 'cohere':
          return await this.callCohereAPI(formattedMessages);
        default:
          throw new Error(`Unsupported provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
