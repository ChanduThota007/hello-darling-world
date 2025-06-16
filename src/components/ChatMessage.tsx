
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Bot, Paperclip, CheckCircle, XCircle, Wrench } from 'lucide-react';
import { ToolResult } from '@/services/toolsService';
import { useTheme } from './ThemeProvider';

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
    toolResult?: ToolResult;
  };
  userAvatar?: string;
  aiAvatar?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, userAvatar, aiAvatar }) => {
  const isUser = message.sender === 'user';
  const { actualTheme } = useTheme();
  
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
          "text-white",
          actualTheme === 'light' ? "bg-gray-800" : "bg-white text-gray-800"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2 text-sm",
        // In light mode: dark bubbles, in dark mode: white bubbles
        actualTheme === 'light' 
          ? "bg-gray-800 text-white" 
          : "bg-white text-gray-800"
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {message.file && (
          <div className={cn(
            "mt-2 p-2 rounded border flex items-center gap-2 text-xs",
            actualTheme === 'light' ? "bg-white/10" : "bg-gray-800/10"
          )}>
            <Paperclip className="h-3 w-3" />
            <span>{message.file.name}</span>
            <span className="opacity-70">({(message.file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        {message.toolResult && (
          <Card className={cn(
            "mt-2 text-xs",
            actualTheme === 'light' ? "bg-white/10" : "bg-gray-800/10"
          )}>
            <CardHeader className="p-2 pb-1">
              <div className="flex items-center gap-2">
                <Wrench className="h-3 w-3" />
                <CardTitle className="text-xs flex items-center gap-1">
                  Tool Result
                  {message.toolResult.success ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                </CardTitle>
                {message.toolResult.metadata?.type && (
                  <Badge variant="outline" className="text-xs">
                    {message.toolResult.metadata.type}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              {message.toolResult.success ? (
                <div className="space-y-1">
                  {message.toolResult.data && (
                    <pre className={cn(
                      "text-xs p-2 rounded overflow-x-auto",
                      actualTheme === 'light' ? "bg-white/20" : "bg-gray-800/20"
                    )}>
                      {typeof message.toolResult.data === 'object' 
                        ? JSON.stringify(message.toolResult.data, null, 2)
                        : String(message.toolResult.data)
                      }
                    </pre>
                  )}
                </div>
              ) : (
                <div className="text-red-500 text-xs">
                  Error: {message.toolResult.error}
                </div>
              )}
            </CardContent>
          </Card>
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
