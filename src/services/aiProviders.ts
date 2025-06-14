
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
  },
  {
    id: 'together',
    name: 'Together AI',
    description: 'Fast inference for open-source models with free credits',
    isFree: true,
    requiresApiKey: true,
    models: ['mistralai/Mixtral-8x7B-Instruct-v0.1', 'meta-llama/Llama-2-70b-chat-hf', 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'],
    trialType: 'free-trial',
    endpoint: 'https://api.together.xyz/v1/chat/completions'
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'Research-focused AI with free tier and web search capabilities',
    isFree: true,
    requiresApiKey: true,
    models: ['llama-3.1-sonar-small-128k-online', 'llama-3.1-sonar-large-128k-online', 'llama-3.1-8b-instruct'],
    trialType: 'free-trial',
    endpoint: 'https://api.perplexity.ai/chat/completions'
  }
];
