
export interface AIProvider {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  requiresApiKey: boolean;
  models: string[];
  trialType?: 'free-trial' | 'completely-free';
  endpoint?: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 - Industry leading AI models',
    isFree: false,
    requiresApiKey: true,
    models: ['gpt-4.1-2025-04-14', 'gpt-4-turbo-preview', 'gpt-3.5-turbo', 'gpt-4'],
    trialType: 'free-trial',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude 4 and Claude 3.5 - Advanced reasoning and analysis',
    isFree: false,
    requiresApiKey: true,
    models: ['claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022', 'claude-3-5-sonnet-20241022'],
    trialType: 'free-trial',
    endpoint: 'https://api.anthropic.com/v1/messages'
  },
  {
    id: 'google',
    name: 'Google Gemini',
    description: 'Gemini Pro and Flash - Google\'s advanced AI models',
    isFree: true,
    requiresApiKey: true,
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    trialType: 'free-trial',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference with Llama and Mixtral models',
    isFree: true,
    requiresApiKey: true,
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    trialType: 'completely-free',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Open-source and commercial Mistral models',
    isFree: false,
    requiresApiKey: true,
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
    trialType: 'free-trial',
    endpoint: 'https://api.mistral.ai/v1/chat/completions'
  }
];
