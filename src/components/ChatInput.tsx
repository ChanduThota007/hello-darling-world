
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { VoiceHandler } from './VoiceHandler';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  hasApiKey: boolean;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  onSendMessage: (content: string) => void;
  onVoiceResult: (transcript: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  isLoading,
  hasApiKey,
  isListening,
  setIsListening,
  onSendMessage,
  onVoiceResult
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(inputValue);
    }
  };

  return (
    <div className="border-t bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={hasApiKey ? "Ask anything..." : "Connect to an AI provider to start chatting..."}
              disabled={isLoading}
              className="flex-1 h-12 text-base"
            />
            <Button
              onClick={() => onSendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              size="icon"
              className="h-12 w-12"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <VoiceHandler
            onSpeechResult={onVoiceResult}
            isListening={isListening}
            setIsListening={setIsListening}
          />
        </div>
      </div>
    </div>
  );
};
