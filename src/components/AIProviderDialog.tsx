
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  currentProvider = 'openai'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Connect to OpenAI
          </DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to enable Nova's AI capabilities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">OpenAI</span>
                </div>
                <p className="text-sm text-muted-foreground">Industry leading AI models including GPT-4</p>
              </div>
            </div>
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
                  onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                  className="h-auto p-0 text-xs text-primary hover:underline"
                >
                  Get your API key from OpenAI Platform
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <Input
                id="apikey"
                type="password"
                placeholder="sk-..."
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
