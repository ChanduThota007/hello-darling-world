
import React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      onFileSelect(file);
      toast({
        title: "File selected",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      });
    }
    
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  return (
    <TooltipProvider>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,text/*,.pdf,.doc,.docx"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={disabled}
            className="h-12 w-12"
            title="Attach Files"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Attach Files</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
