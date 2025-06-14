
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
import { User, Camera, Bot, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserAvatar?: string;
  currentAiAvatar?: string;
  onUserAvatarChange: (avatarUrl: string) => void;
  onAiAvatarChange: (avatarUrl: string) => void;
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

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  open,
  onOpenChange,
  currentUserAvatar,
  currentAiAvatar,
  onUserAvatarChange,
  onAiAvatarChange
}) => {
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'user' | 'ai'>('user');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'user' | 'ai') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'user') {
          onUserAvatarChange(result);
        } else {
          onAiAvatarChange(result);
        }
        toast({
          title: "Avatar Updated",
          description: `${type === 'user' ? 'Your' : 'AI'} profile photo has been uploaded successfully!`,
        });
        onOpenChange(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (avatarUrl: string, type: 'user' | 'ai') => {
    if (type === 'user') {
      onUserAvatarChange(avatarUrl);
    } else {
      onAiAvatarChange(avatarUrl);
    }
    toast({
      title: "Avatar Updated",
      description: `${type === 'user' ? 'Your' : 'AI'} profile photo has been changed successfully!`,
    });
    onOpenChange(false);
  };

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      if (activeTab === 'user') {
        onUserAvatarChange(customUrl.trim());
      } else {
        onAiAvatarChange(customUrl.trim());
      }
      toast({
        title: "Avatar Updated",
        description: `${activeTab === 'user' ? 'Your' : 'AI'} profile photo has been changed successfully!`,
      });
      setCustomUrl('');
      onOpenChange(false);
    }
  };

  const handleRemoveAvatar = () => {
    if (activeTab === 'user') {
      onUserAvatarChange('');
    } else {
      onAiAvatarChange('');
    }
    toast({
      title: "Avatar Removed",
      description: `${activeTab === 'user' ? 'Your' : 'AI'} profile photo has been removed.`,
    });
    onOpenChange(false);
  };

  const currentAvatar = activeTab === 'user' ? currentUserAvatar : currentAiAvatar;
  const presetAvatars = activeTab === 'user' ? presetUserAvatars : presetAiAvatars;

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
          {/* Tab Selection */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'user' ? 'default' : 'outline'}
              onClick={() => setActiveTab('user')}
              className="flex-1 gap-2"
            >
              <User className="h-4 w-4" />
              Your Avatar
            </Button>
            <Button
              variant={activeTab === 'ai' ? 'default' : 'outline'}
              onClick={() => setActiveTab('ai')}
              className="flex-1 gap-2"
            >
              <Bot className="h-4 w-4" />
              AI Avatar
            </Button>
          </div>

          {/* Current Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentAvatar} alt="Current avatar" />
              <AvatarFallback>
                {activeTab === 'user' ? <User className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              Current {activeTab === 'user' ? 'User' : 'AI'} Avatar
            </p>
          </div>

          {/* Upload from Device */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Upload from device:</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, activeTab)}
                className="hidden"
                id={`file-upload-${activeTab}`}
              />
              <label
                htmlFor={`file-upload-${activeTab}`}
                className="flex-1 flex items-center justify-center gap-2 h-10 px-4 py-2 bg-background border border-input rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </label>
            </div>
          </div>

          {/* Preset Avatars */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose from presets:</Label>
            <div className="grid grid-cols-4 gap-3">
              {presetAvatars.map((avatarUrl, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSelect(avatarUrl, activeTab)}
                  className="relative group"
                >
                  <Avatar className="h-16 w-16 hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={avatarUrl} alt={`Preset ${index + 1}`} />
                    <AvatarFallback>
                      {activeTab === 'user' ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
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
