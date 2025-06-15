import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, ExternalLink, Sparkles } from 'lucide-react';
import { AI_PROVIDERS, AIProvider } from '@/services/aiProviders';

interface AIProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProviderSet: (providerId: string, apiKey: string, model?: string) => void;
  currentProvider?: string;
}

export const AIProviderDialog: React.FC<AIProviderDialogProps> = ({ 
  open, 
  onOpenChange, 
  onProviderSet,
  currentProvider = 'groq'
}) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(
    AI_PROVIDERS.find(p => p.id === currentProvider) || AI_PROVIDERS[0]
  );
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState(selectedProvider.models[0]);

  useEffect(() => {
    if (selectedProvider) {
      setSelectedModel(selectedProvider.models[0]);
    }
  }, [selectedProvider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onProviderSet(selectedProvider.id, apiKey.trim(), selectedModel);
      onOpenChange(false);
      setApiKey('');
    }
  };

  const getApiKeyUrl = (providerId: string) => {
    switch (providerId) {
      case 'openai':
        return 'https://platform.openai.com/api-keys';
      case 'google':
        return 'https://makersuite.google.com/app/apikey';
      case 'groq':
        return 'https://console.groq.com/keys';
      case 'huggingface':
        return 'https://huggingface.co/settings/tokens';
      case 'together':
        return 'https://api.together.xyz/settings/api-keys';
      case 'perplexity':
        return 'https://www.perplexity.ai/settings/api';
      default:
        return '#';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Connect AI Provider
          </DialogTitle>
          <DialogDescription>
            Choose an AI provider and enter your API key to enable Nova's capabilities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>AI Provider</Label>
            {AI_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedProvider.id === provider.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedProvider(provider)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{provider.name}</span>
                      {provider.isFree && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                          {provider.trialType === 'completely-free' ? 'FREE' : 'FREE TRIAL'}
                        </span>
                      )}
                      {!provider.isFree && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                          PAID
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{provider.description}</p>
                  </div>
                  {selectedProvider.id === provider.id && (
                    <Sparkles className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvider.models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="apikey">API Key</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(getApiKeyUrl(selectedProvider.id), '_blank')}
                  className="h-auto p-0 text-xs text-primary hover:underline"
                >
                  Get API key for {selectedProvider.name}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <Input
                id="apikey"
                type="password"
                placeholder={
                  selectedProvider.id === 'google' ? 'AIza...' : 
                  selectedProvider.id === 'huggingface' ? 'hf_...' :
                  selectedProvider.id === 'together' ? 'together_...' :
                  selectedProvider.id === 'perplexity' ? 'pplx-...' :
                  'sk-...'
                }
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!apiKey.trim()}>
                Connect
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
