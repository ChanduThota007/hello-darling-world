
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Clock, Star, Folder } from 'lucide-react';
import { chatHistoryService, ChatHistory } from '@/services/chatHistoryService';

interface ChatSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectChat: (chat: ChatHistory) => void;
}

export const ChatSearch: React.FC<ChatSearchProps> = ({
  open,
  onOpenChange,
  onSelectChat
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ChatHistory[]>([]);
  const [recentChats, setRecentChats] = useState<ChatHistory[]>([]);

  useEffect(() => {
    if (open) {
      // Load recent chats when dialog opens
      const allChats = chatHistoryService.getAllChats();
      setRecentChats(allChats.slice(0, 5));
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = chatHistoryService.searchChats(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelectChat = (chat: ChatHistory) => {
    onSelectChat(chat);
    onOpenChange(false);
  };

  const chatsToShow = query.trim() ? results : recentChats;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Conversations
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Search conversations... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12"
            autoFocus
          />
          
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {chatsToShow.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {query.trim() ? 'No conversations found' : 'No recent conversations'}
                </div>
              ) : (
                chatsToShow.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start p-4 h-auto"
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="flex-1 text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{chat.title}</span>
                        {chat.isBookmarked && <Star className="h-4 w-4 text-yellow-500" />}
                        {chat.folderId && <Folder className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {chat.updatedAt.toLocaleDateString()}
                        <Badge variant="secondary" className="text-xs">
                          {chat.messages.length} messages
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.messages[chat.messages.length - 1]?.content || 'No messages'}
                      </p>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+K</kbd> to search</p>
            <p><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+N</kbd> new chat</p>
            <p><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+/</kbd> focus input</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
