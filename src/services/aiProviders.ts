
export interface AIProvider {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  requiresApiKey: boolean;
  models: string[];
  trialType?: 'free-trial' | 'completely-free';
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    description: 'Completely free ultra-fast inference with Llama models',
    isFree: true,
    requiresApiKey: true,
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    trialType: 'completely-free'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Completely free AI models via Inference API',
    isFree: true,
    requiresApiKey: true,
    models: ['microsoft/DialoGPT-large', 'facebook/blenderbot-400M-distill', 'meta-llama/Llama-2-7b-chat-hf'],
    trialType: 'completely-free'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 - Free trial ($5 credit), then paid',
    isFree: false,
    requiresApiKey: true,
    models: ['gpt-4-turbo-preview', 'gpt-3.5-turbo'],
    trialType: 'free-trial'
  }
];
