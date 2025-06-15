
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Settings, Plus, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { AIProvider } from '@/services/aiProviders';

interface ChatHeaderProps {
  hasMessages: boolean;
  hasApiKey: boolean;
  currentProvider?: AIProvider;
  currentModel?: string;
  userAvatar: string;
  onNewChat: () => void;
  onShowApiDialog: () => void;
  onShowProfileDialog: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  hasMessages,
  hasApiKey,
  currentProvider,
  currentModel,
  userAvatar,
  onNewChat,
  onShowApiDialog,
  onShowProfileDialog
}) => {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Nova</h1>
            </div>
            {hasMessages && (
              <div className="text-sm text-muted-foreground">
                Your Personal AI Assistant
              </div>
            )}
            {hasApiKey && currentProvider && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {currentProvider.name} Connected
                  {currentProvider.isFree && (
                    <span className="ml-1 px-1 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                      FREE
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Model: {currentModel}
                </div>
              </div>
            )}
          </div>
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={onShowProfileDialog}
                    className="h-8 w-8"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={userAvatar} alt="User avatar" />
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change Profile Photo</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onNewChat}
                    className="h-8 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start New Conversation</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={onShowApiDialog}
                    className="h-8 w-8"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI Provider Settings</p>
                </TooltipContent>
              </Tooltip>
              
              <ThemeToggle />
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
