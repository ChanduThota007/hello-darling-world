
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Download, FileText, FileCode, File } from 'lucide-react';
import { chatHistoryService, ChatHistory } from '@/services/chatHistoryService';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: ChatHistory;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  chat
}) => {
  const [format, setFormat] = useState<'json' | 'markdown' | 'txt'>('markdown');

  const formatOptions = [
    { value: 'markdown', label: 'Markdown (.md)', icon: FileText },
    { value: 'json', label: 'JSON (.json)', icon: FileCode },
    { value: 'txt', label: 'Plain Text (.txt)', icon: File }
  ];

  const handleExport = () => {
    try {
      const content = chatHistoryService.exportChat(chat.id, format);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Chat exported as ${format.toUpperCase()}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the chat",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Conversation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Export Format</label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm">Preview</h4>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Title:</strong> {chat.title}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Messages:</strong> {chat.messages.length}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Created:</strong> {chat.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
