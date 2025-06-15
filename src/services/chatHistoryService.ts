
export interface ChatHistory {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'nova';
    timestamp: Date;
    file?: any;
    toolResult?: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
  folderId?: string;
  isBookmarked?: boolean;
}

export interface ChatFolder {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

class ChatHistoryService {
  private storageKey = 'nova-chat-history';
  private foldersKey = 'nova-chat-folders';

  saveChat(chat: ChatHistory): void {
    const history = this.getAllChats();
    const existingIndex = history.findIndex(c => c.id === chat.id);
    
    if (existingIndex >= 0) {
      history[existingIndex] = { ...chat, updatedAt: new Date() };
    } else {
      history.push(chat);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  getAllChats(): ChatHistory[] {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    
    return JSON.parse(stored).map((chat: any) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  }

  deleteChat(id: string): void {
    const history = this.getAllChats().filter(c => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  searchChats(query: string): ChatHistory[] {
    const allChats = this.getAllChats();
    return allChats.filter(chat => 
      chat.title.toLowerCase().includes(query.toLowerCase()) ||
      chat.messages.some(msg => 
        msg.content.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  toggleBookmark(chatId: string): void {
    const history = this.getAllChats();
    const chat = history.find(c => c.id === chatId);
    if (chat) {
      chat.isBookmarked = !chat.isBookmarked;
      this.saveChat(chat);
    }
  }

  // Folder management
  createFolder(name: string, color: string): ChatFolder {
    const folder: ChatFolder = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date()
    };
    
    const folders = this.getAllFolders();
    folders.push(folder);
    localStorage.setItem(this.foldersKey, JSON.stringify(folders));
    return folder;
  }

  getAllFolders(): ChatFolder[] {
    const stored = localStorage.getItem(this.foldersKey);
    if (!stored) return [];
    
    return JSON.parse(stored).map((folder: any) => ({
      ...folder,
      createdAt: new Date(folder.createdAt)
    }));
  }

  moveChatToFolder(chatId: string, folderId?: string): void {
    const history = this.getAllChats();
    const chat = history.find(c => c.id === chatId);
    if (chat) {
      chat.folderId = folderId;
      this.saveChat(chat);
    }
  }

  exportChat(chatId: string, format: 'json' | 'markdown' | 'txt'): string {
    const chat = this.getAllChats().find(c => c.id === chatId);
    if (!chat) return '';

    switch (format) {
      case 'json':
        return JSON.stringify(chat, null, 2);
      case 'markdown':
        return this.toMarkdown(chat);
      case 'txt':
        return this.toText(chat);
      default:
        return '';
    }
  }

  private toMarkdown(chat: ChatHistory): string {
    let md = `# ${chat.title}\n\n`;
    md += `**Created:** ${chat.createdAt.toLocaleString()}\n\n`;
    
    chat.messages.forEach(msg => {
      md += `## ${msg.sender === 'user' ? 'You' : 'Nova'}\n`;
      md += `*${msg.timestamp.toLocaleString()}*\n\n`;
      md += `${msg.content}\n\n`;
      if (msg.file) {
        md += `📎 Attached: ${msg.file.name}\n\n`;
      }
    });
    
    return md;
  }

  private toText(chat: ChatHistory): string {
    let text = `${chat.title}\n${'='.repeat(chat.title.length)}\n\n`;
    text += `Created: ${chat.createdAt.toLocaleString()}\n\n`;
    
    chat.messages.forEach(msg => {
      text += `${msg.sender === 'user' ? 'You' : 'Nova'} (${msg.timestamp.toLocaleString()}):\n`;
      text += `${msg.content}\n\n`;
    });
    
    return text;
  }
}

export const chatHistoryService = new ChatHistoryService();
