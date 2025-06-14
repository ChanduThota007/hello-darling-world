
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot, ExternalLink } from 'lucide-react';
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

  const getApiKeyInstructions = (provider: AIProvider) => {
    switch (provider.id) {
      case 'groq':
        return {
          url: 'https://console.groq.com/keys',
          text: 'Get your free API key from Groq Console'
        };
      case 'huggingface':
        return {
          url: 'https://huggingface.co/settings/tokens',
          text: 'Get your free token from Hugging Face'
        };
      case 'cohere':
        return {
          url: 'https://dashboard.cohere.ai/api-keys',
          text: 'Get your API key from Cohere Dashboard'
        };
      case 'openai':
        return {
          url: 'https://platform.openai.com/api-keys',
          text: 'Get your API key from OpenAI Platform'
        };
      default:
        return { url: '', text: '' };
    }
  };

  const instructions = getApiKeyInstructions(selectedProvider);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Choose AI Provider
          </DialogTitle>
          <DialogDescription>
            Select your preferred AI provider and enter your API key to enable Nova's capabilities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
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
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{provider.name}</span>
                      {provider.isFree && (
                        <Badge variant="secondary" className="text-xs">
                          FREE
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                  </div>
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
                {instructions.url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(instructions.url, '_blank')}
                    className="h-auto p-0 text-xs text-primary hover:underline"
                  >
                    {instructions.text}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
              <Input
                id="apikey"
                type="password"
                placeholder="Enter your API key..."
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
