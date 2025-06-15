
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  type: 'user' | 'ai';
  onAvatarChange: (avatarUrl: string) => void;
  onDialogClose: () => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ type, onAvatarChange, onDialogClose }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onAvatarChange(result);
        toast({
          title: "Avatar Updated",
          description: `${type === 'user' ? 'Your' : 'AI'} profile photo has been uploaded successfully!`,
        });
        onDialogClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Upload from device:</Label>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id={`file-upload-${type}`}
        />
        <label
          htmlFor={`file-upload-${type}`}
          className="flex-1 flex items-center justify-center gap-2 h-10 px-4 py-2 bg-background border border-input rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Upload className="h-4 w-4" />
          Choose File
        </label>
      </div>
    </div>
  );
};
