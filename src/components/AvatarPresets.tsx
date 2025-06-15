
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { User, Bot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AvatarPresetsProps {
  type: 'user' | 'ai';
  onAvatarChange: (avatarUrl: string) => void;
  onDialogClose: () => void;
}

const presetUserAvatars = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face"
];

const presetAiAvatars = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop&crop=face"
];

export const AvatarPresets: React.FC<AvatarPresetsProps> = ({ type, onAvatarChange, onDialogClose }) => {
  const presetAvatars = type === 'user' ? presetUserAvatars : presetAiAvatars;

  const handlePresetSelect = (avatarUrl: string) => {
    onAvatarChange(avatarUrl);
    toast({
      title: "Avatar Updated",
      description: `${type === 'user' ? 'Your' : 'AI'} profile photo has been changed successfully!`,
    });
    onDialogClose();
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Choose from presets:</Label>
      <div className="grid grid-cols-4 gap-3">
        {presetAvatars.map((avatarUrl, index) => (
          <button
            key={index}
            onClick={() => handlePresetSelect(avatarUrl)}
            className="relative group"
          >
            <Avatar className="h-16 w-16 hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src={avatarUrl} alt={`Preset ${index + 1}`} />
              <AvatarFallback>
                {type === 'user' ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
          </button>
        ))}
      </div>
    </div>
  );
};
