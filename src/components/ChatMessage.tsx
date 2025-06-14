
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'nova';
    timestamp: Date;
  };
  userAvatar?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, userAvatar }) => {
  const isUser = message.sender === 'user';
  
  // AI avatar - using a nice placeholder image
  const aiAvatar = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face";
  
  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-fade-in",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage 
          src={isUser ? userAvatar : aiAvatar} 
          alt={isUser ? "User" : "Nova AI"} 
        />
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2 text-sm",
        isUser 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-muted text-muted-foreground"
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <time className={cn(
          "text-xs mt-1 block opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    </div>
  );
};
