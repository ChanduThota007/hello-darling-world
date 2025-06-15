
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface AvatarCustomUrlProps {
  type: 'user' | 'ai';
  onAvatarChange: (avatarUrl: string) => void;
  onDialogClose: () => void;
}

export const AvatarCustomUrl: React.FC<AvatarCustomUrlProps> = ({ type, onAvatarChange, onDialogClose }) => {
  const [customUrl, setCustomUrl] = useState('');

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      onAvatarChange(customUrl.trim());
      toast({
        title: "Avatar Updated",
        description: `${type === 'user' ? 'Your' : 'AI'} profile photo has been changed successfully!`,
      });
      setCustomUrl('');
      onDialogClose();
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="custom-url" className="text-sm font-medium">
        Or use custom image URL:
      </Label>
      <div className="flex gap-2">
        <Input
          id="custom-url"
          placeholder="https://example.com/avatar.jpg"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
        />
        <Button onClick={handleCustomUrl} disabled={!customUrl.trim()}>
          Use
        </Button>
      </div>
    </div>
  );
};
