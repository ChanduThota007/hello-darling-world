
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
  inputRef?: React.RefObject<HTMLInputElement>;
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
  onShowToolsDialog,
  inputRef
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
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const removeTool = () => {
    setSelectedTool(null);
  };

  return (
    <div>
      {(selectedFile || selectedTool) && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-muted rounded-lg">
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
      
      <div className="bg-background border border-border rounded-3xl shadow-sm p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side icons */}
          <div className="flex items-center gap-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={isLoading}
            />
            
            <ToolsSelector
              onToolSelect={handleToolSelect}
              onShowToolsDialog={onShowToolsDialog}
              disabled={isLoading}
            />
          </div>
          
          {/* Center - Input field */}
          <div className="flex-1 max-w-md">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={hasApiKey ? (selectedTool ? `Using ${selectedTool} - describe what you want...` : "Ask anything") : "Connect to an AI provider to start chatting..."}
              disabled={isLoading}
              className="h-10 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 placeholder:text-muted-foreground/60 placeholder:font-bold"
            />
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <VoiceHandler
              onSpeechResult={onVoiceResult}
              isListening={isListening}
              setIsListening={setIsListening}
            />
            
            <TooltipProvider>
              <Button
                onClick={handleSend}
                disabled={isLoading || (!inputValue.trim() && !selectedFile)}
                size="icon"
                className="h-8 w-8 rounded-full"
                title="Send Message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
