
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AvatarTabSelector } from './AvatarTabSelector';
import { AvatarPreview } from './AvatarPreview';
import { AvatarUpload } from './AvatarUpload';
import { AvatarPresets } from './AvatarPresets';
import { AvatarCustomUrl } from './AvatarCustomUrl';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserAvatar?: string;
  currentAiAvatar?: string;
  onUserAvatarChange: (avatarUrl: string) => void;
  onAiAvatarChange: (avatarUrl: string) => void;
}

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  open,
  onOpenChange,
  currentUserAvatar,
  currentAiAvatar,
  onUserAvatarChange,
  onAiAvatarChange
}) => {
  const [activeTab, setActiveTab] = useState<'user' | 'ai'>('user');

  const handleAvatarChange = (avatarUrl: string) => {
    if (activeTab === 'user') {
      onUserAvatarChange(avatarUrl);
    } else {
      onAiAvatarChange(avatarUrl);
    }
  };

  const handleRemoveAvatar = () => {
    handleAvatarChange('');
    toast({
      title: "Avatar Removed",
      description: `${activeTab === 'user' ? 'Your' : 'AI'} profile photo has been removed.`,
    });
    onOpenChange(false);
  };

  const currentAvatar = activeTab === 'user' ? currentUserAvatar : currentAiAvatar;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Change Profile Photos
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <AvatarTabSelector 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          <AvatarPreview 
            avatar={currentAvatar} 
            type={activeTab} 
          />

          <AvatarUpload
            type={activeTab}
            onAvatarChange={handleAvatarChange}
            onDialogClose={() => onOpenChange(false)}
          />

          <AvatarPresets
            type={activeTab}
            onAvatarChange={handleAvatarChange}
            onDialogClose={() => onOpenChange(false)}
          />

          <AvatarCustomUrl
            type={activeTab}
            onAvatarChange={handleAvatarChange}
            onDialogClose={() => onOpenChange(false)}
          />

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleRemoveAvatar} className="flex-1">
              Remove Avatar
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
