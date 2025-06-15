
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
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference with powerful Llama models - Completely FREE',
    isFree: true,
    requiresApiKey: true,
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    trialType: 'completely-free',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Industry-leading ChatGPT models with excellent performance',
    isFree: false,
    requiresApiKey: true,
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  {
    id: 'google',
    name: 'Google Gemini',
    description: 'Google\'s advanced AI models with generous free tier',
    isFree: true,
    requiresApiKey: true,
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    trialType: 'free-trial',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Free open-source models via Hugging Face Inference API',
    isFree: true,
    requiresApiKey: true,
    models: ['microsoft/DialoGPT-large', 'facebook/blenderbot-400M-distill', 'microsoft/DialoGPT-medium'],
    trialType: 'completely-free',
    endpoint: 'https://api-inference.huggingface.co/models'
  }
];
