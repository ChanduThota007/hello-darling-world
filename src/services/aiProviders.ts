
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
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 - Industry leading AI models',
    isFree: false,
    requiresApiKey: true,
    models: ['gpt-4-turbo-preview', 'gpt-3.5-turbo', 'gpt-4'],
    trialType: 'free-trial'
  }
];
