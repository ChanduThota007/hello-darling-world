
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { VoiceHandler } from './VoiceHandler';
import { FileUpload } from './FileUpload';
import { ToolsSelector } from './ToolsSelector';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  hasApiKey: boolean;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  onSendMessage: (content: string, file?: File, toolId?: string) => void;
  onVoiceResult: (transcript: string) => void;
  onShowToolsDialog: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  isLoading,
  hasApiKey,
  isListening,
  setIsListening,
  onSendMessage,
  onVoiceResult,
  onShowToolsDialog
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    onSendMessage(inputValue, selectedFile || undefined, selectedTool || undefined);
    setSelectedFile(null);
    setSelectedTool(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    // Auto-focus input and add tool indicator
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const removeTool = () => {
    setSelectedTool(null);
  };

  return (
    <div className="border-t bg-card">
      <div className="container mx-auto px-4 py-4">
        {(selectedFile || selectedTool) && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-muted rounded-md max-w-3xl mx-auto">
            {selectedFile && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
                <Button size="sm" variant="ghost" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {selectedTool && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  🔧 Using tool: {selectedTool}
                </span>
                <Button size="sm" variant="ghost" onClick={removeTool}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={hasApiKey ? (selectedTool ? `Using ${selectedTool} - describe what you want...` : "Ask anything...") : "Connect to an AI provider to start chatting..."}
              disabled={isLoading}
              className="flex-1 h-12 text-base"
            />
            <TooltipProvider>
              <Button
                onClick={handleSend}
                disabled={isLoading || (!inputValue.trim() && !selectedFile)}
                size="icon"
                className="h-12 w-12"
                title="Send Message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </TooltipProvider>
          </div>
          <FileUpload
            onFileSelect={handleFileSelect}
            disabled={isLoading}
          />
          <ToolsSelector
            onToolSelect={handleToolSelect}
            onShowToolsDialog={onShowToolsDialog}
            disabled={isLoading}
          />
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
