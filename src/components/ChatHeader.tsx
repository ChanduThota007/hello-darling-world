
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Settings, Plus, User, Search, Download } from 'lucide-react';
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
  onShowSearch: () => void;
  onShowExport?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  hasMessages,
  hasApiKey,
  currentProvider,
  currentModel,
  userAvatar,
  onNewChat,
  onShowApiDialog,
  onShowProfileDialog,
  onShowSearch,
  onShowExport
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
                    variant="ghost"
                    onClick={onShowProfileDialog}
                    className="h-10 w-10"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={userAvatar} alt="User avatar" />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
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
                    size="icon"
                    variant="ghost"
                    onClick={onShowSearch}
                    className="h-8 w-8"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search Conversations (Ctrl+K)</p>
                </TooltipContent>
              </Tooltip>

              {onShowExport && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onShowExport}
                      className="h-8 w-8"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export Chat</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onNewChat}
                    className="h-8 w-8"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start New Conversation (Ctrl+N)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onShowApiDialog}
                    className="h-8 w-8"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI Provider Settings (Ctrl+,)</p>
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
