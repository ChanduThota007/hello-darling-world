
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
      <Card className="h-full flex flex-col">
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
      </Card>
    </div>
  );
};
