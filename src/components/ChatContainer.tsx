
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChatMessage } from './ChatMessage';
import { LoadingIndicator } from './LoadingIndicator';
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
  // Props that are passed through but not used directly in this component
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
  messagesEndRef
}) => {
  return (
    <div className="container mx-auto px-4 py-4 h-full">
      <Card className="h-full">
        <CardContent className="h-full overflow-y-auto p-4 space-y-4">
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
      </Card>
    </div>
  );
};
