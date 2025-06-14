
export interface AIProvider {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  requiresApiKey: boolean;
  models: string[];
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    description: 'Free ultra-fast inference with Llama models',
    isFree: true,
    requiresApiKey: true,
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768']
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Free AI models via Inference API',
    isFree: true,
    requiresApiKey: true,
    models: ['microsoft/DialoGPT-large', 'facebook/blenderbot-400M-distill']
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: 'Free tier available for Command models',
    isFree: true,
    requiresApiKey: true,
    models: ['command-light', 'command']
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 (Paid)',
    isFree: false,
    requiresApiKey: true,
    models: ['gpt-4-turbo-preview', 'gpt-3.5-turbo']
  }
];
