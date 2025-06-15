
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

interface AvatarPreviewProps {
  avatar?: string;
  type: 'user' | 'ai';
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({ avatar, type }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatar} alt="Current avatar" />
        <AvatarFallback>
          {type === 'user' ? <User className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
        </AvatarFallback>
      </Avatar>
      <p className="text-sm text-muted-foreground">
        Current {type === 'user' ? 'User' : 'AI'} Avatar
      </p>
    </div>
  );
};
