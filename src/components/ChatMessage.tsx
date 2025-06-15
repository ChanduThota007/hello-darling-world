
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot, Paperclip } from 'lucide-react';

interface ChatMessageProps {
  message: {
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
  };
  userAvatar?: string;
  aiAvatar?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, userAvatar, aiAvatar }) => {
  const isUser = message.sender === 'user';
  
  // Default AI avatar if none provided
  const defaultAiAvatar = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face";
  
  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-fade-in",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage 
          src={isUser ? userAvatar : (aiAvatar || defaultAiAvatar)} 
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
        
        {message.file && (
          <div className={cn(
            "mt-2 p-2 rounded border flex items-center gap-2 text-xs",
            isUser ? "bg-primary-foreground/10" : "bg-background/50"
          )}>
            <Paperclip className="h-3 w-3" />
            <span>{message.file.name}</span>
            <span className="opacity-70">({(message.file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}
        
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
