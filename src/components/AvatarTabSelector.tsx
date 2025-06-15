
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Bot } from 'lucide-react';

interface AvatarTabSelectorProps {
  activeTab: 'user' | 'ai';
  onTabChange: (tab: 'user' | 'ai') => void;
}

export const AvatarTabSelector: React.FC<AvatarTabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={activeTab === 'user' ? 'default' : 'outline'}
        onClick={() => onTabChange('user')}
        className="flex-1 gap-2"
      >
        <User className="h-4 w-4" />
        Your Avatar
      </Button>
      <Button
        variant={activeTab === 'ai' ? 'default' : 'outline'}
        onClick={() => onTabChange('ai')}
        className="flex-1 gap-2"
      >
        <Bot className="h-4 w-4" />
        AI Avatar
      </Button>
    </div>
  );
};
