
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
}

const presetAvatars = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face"
];

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  open,
  onOpenChange,
  currentAvatar,
  onAvatarChange
}) => {
  const [customUrl, setCustomUrl] = useState('');

  const handlePresetSelect = (avatarUrl: string) => {
    onAvatarChange(avatarUrl);
    toast({
      title: "Avatar Updated",
      description: "Your profile photo has been changed successfully!",
    });
    onOpenChange(false);
  };

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      onAvatarChange(customUrl.trim());
      toast({
        title: "Avatar Updated",
        description: "Your profile photo has been changed successfully!",
      });
      setCustomUrl('');
      onOpenChange(false);
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarChange('');
    toast({
      title: "Avatar Removed",
      description: "Your profile photo has been removed.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Change Profile Photo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentAvatar} alt="Current avatar" />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">Current Avatar</p>
          </div>

          {/* Preset Avatars */}
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
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL */}
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

          {/* Actions */}
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
