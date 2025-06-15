
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChatMessage } from './ChatMessage';
import { LoadingIndicator } from './LoadingIndicator';
import { ChatInput } from './ChatInput';
import { ToolResult } from '@/services/toolsService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'nova';
  timestamp: Date;
  file?: {
    name: string;
    size: number;
    type: string;
    content?: string;
  };
  toolResult?: ToolResult;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  userAvatar: string;
  aiAvatar: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  // Chat input props
  inputValue: string;
  setInputValue: (value: string) => void;
  hasApiKey: boolean;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  onSendMessage: (content: string, file?: File, toolId?: string) => void;
  onVoiceResult: (transcript: string) => void;
  onShowToolsDialog: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  userAvatar,
  aiAvatar,
  messagesEndRef,
  inputValue,
  setInputValue,
  hasApiKey,
  isListening,
  setIsListening,
  onSendMessage,
  onVoiceResult,
  onShowToolsDialog,
  inputRef
}) => {
  return (
    <div className="container mx-auto px-4 py-4 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              userAvatar={userAvatar}
              aiAvatar={aiAvatar}
            />
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </CardContent>
        
        {/* Integrated Chat Input */}
        <div className="border-t p-4">
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            hasApiKey={hasApiKey}
            isListening={isListening}
            setIsListening={setIsListening}
            onSendMessage={onSendMessage}
            onVoiceResult={onVoiceResult}
            onShowToolsDialog={onShowToolsDialog}
            inputRef={inputRef}
          />
        </div>
      </Card>
    </div>
  );
};
