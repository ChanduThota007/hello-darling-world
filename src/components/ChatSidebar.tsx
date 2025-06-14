
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Settings, User } from 'lucide-react';

interface ChatSidebarProps {
  onNewChat: () => void;
  onSettingsClick: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onNewChat, onSettingsClick }) => {
  // Mock chat history data
  const chatHistory = [
    { id: '1', title: 'Personal AI Agent Tasks', timestamp: 'Yesterday' },
    { id: '2', title: 'Notation Logo Request', timestamp: 'Yesterday' },
    { id: '3', title: 'What is Notation', timestamp: '2 days ago' },
    { id: '4', title: 'What is an API', timestamp: '2 days ago' },
    { id: '5', title: 'Broad Beans Fry Calories', timestamp: '3 days ago' },
    { id: '6', title: 'Check Soya Quality', timestamp: '3 days ago' },
    { id: '7', title: 'Normal Skincare Routine', timestamp: '1 week ago' },
    { id: '8', title: 'Flax Seeds Macros and Calories', timestamp: '1 week ago' },
    { id: '9', title: 'Early morning pre workout', timestamp: '1 week ago' },
    { id: '10', title: 'Minimalist SPF 50 Review', timestamp: '2 weeks ago' },
    { id: '11', title: 'Download n8n Docker', timestamp: '2 weeks ago' },
    { id: '12', title: 'Normal Skin Skincare Tips', timestamp: '2 weeks ago' },
    { id: '13', title: 'Brinjal curry calorie estimate', timestamp: '3 weeks ago' },
  ];

  return (
    <div className="w-64 bg-muted/30 border-r h-full flex flex-col">
      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-start gap-2 h-10"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-3">
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer text-sm group"
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-foreground">{chat.title}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 h-8"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 h-8"
        >
          <User className="h-4 w-4" />
          Upgrade plan
        </Button>
      </div>
    </div>
  );
};
