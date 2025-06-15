import React, { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatContainer } from './ChatContainer';
import { AIProviderDialog } from './AIProviderDialog';
import { UserProfileDialog } from './UserProfileDialog';
import { ToolsDialog } from './ToolsDialog';
import { ChatWelcome } from './ChatWelcome';
import { ChatSearch } from './ChatSearch';
import { ExportDialog } from './ExportDialog';
import { toast } from '@/hooks/use-toast';
import { aiService } from '@/services/aiService';
import { toolsService, ToolResult } from '@/services/toolsService';
import { chatHistoryService, ChatHistory } from '@/services/chatHistoryService';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from './ThemeProvider';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'nova';
  timestamp: Date;
  file?: {
    name: string;
    size: number;
    type: string;
    content?: string;
  };
  toolResult?: ToolResult;
}

export const NovaChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showToolsDialog, setShowToolsDialog] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [aiAvatar, setAiAvatar] = useState<string>('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { setTheme, theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if API key exists on mount
    const checkApiKey = () => {
      const existingKey = aiService.getApiKey();
      const keyExists = !!existingKey;
      setHasApiKey(keyExists);
      
      console.log('API key check:', {
        provider: aiService.getProvider()?.name,
        hasKey: keyExists,
        keyLength: existingKey?.length || 0
      });
    };

    // Load user and AI avatars from localStorage
    const savedUserAvatar = localStorage.getItem('nova-user-avatar');
    const savedAiAvatar = localStorage.getItem('nova-ai-avatar');
    
    if (savedUserAvatar) {
      setUserAvatar(savedUserAvatar);
    }
    
    if (savedAiAvatar) {
      setAiAvatar(savedAiAvatar);
    }

    // Initial check
    checkApiKey();
    
    // Also check periodically to catch any storage changes
    const interval = setInterval(checkApiKey, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-save current chat
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      const chatTitle = messages[0]?.content.substring(0, 50) + '...' || 'New Chat';
      const chatData: ChatHistory = {
        id: currentChatId,
        title: chatTitle,
        messages,
        createdAt: new Date(currentChatId),
        updatedAt: new Date()
      };
      chatHistoryService.saveChat(chatData);
      setCurrentChat(chatData);
    }
  }, [messages, currentChatId]);

  const handleUserAvatarChange = (avatarUrl: string) => {
    setUserAvatar(avatarUrl);
    localStorage.setItem('nova-user-avatar', avatarUrl);
  };

  const handleAiAvatarChange = (avatarUrl: string) => {
    setAiAvatar(avatarUrl);
    localStorage.setItem('nova-ai-avatar', avatarUrl);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setCurrentChatId(Date.now().toString());
    setCurrentChat(null);
  };

  const handleSelectChat = (chat: ChatHistory) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setCurrentChat(chat);
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onNewChat: handleNewChat,
    onToggleTheme: toggleTheme,
    onFocusInput: handleFocusInput,
    onShowSettings: () => setShowApiDialog(true),
    onShowSearch: () => setShowSearchDialog(true)
  });

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSendMessage = async (content: string, file?: File, toolId?: string) => {
    if (!content.trim() && !file) return;

    if (!hasApiKey) {
      setShowApiDialog(true);
      toast({
        title: "API Key Required",
        description: "Please connect to an AI provider first to start chatting.",
        variant: "destructive"
      });
      return;
    }

    // Create new chat if none exists
    if (!currentChatId) {
      setCurrentChatId(Date.now().toString());
    }

    let fileContent: string | undefined;
    let fileInfo: Message['file'] | undefined;
    let toolResult: ToolResult | undefined;

    if (file) {
      try {
        fileContent = await readFileContent(file);
        fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
          content: fileContent
        };
      } catch (error) {
        toast({
          title: "File Error",
          description: "Failed to read the selected file",
          variant: "destructive"
        });
        return;
      }
    }

    // Execute tool if selected
    if (toolId) {
      try {
        toolResult = await toolsService.executeTool(toolId, content, { file: fileInfo });
        if (!toolResult.success) {
          toast({
            title: "Tool Error",
            description: toolResult.error || "Failed to execute tool",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Tool execution error:', error);
        toast({
          title: "Tool Error",
          description: "Failed to execute the selected tool",
          variant: "destructive"
        });
      }
    }

    const messageContent = content.trim() || `Attached file: ${file?.name}`;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      file: fileInfo,
      toolResult
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].slice(-10);
      console.log('Sending to AI service:', conversationHistory);
      
      // Include file content and tool results in the AI request if available
      let aiPrompt = messageContent;
      if (fileContent && file) {
        if (file.type.startsWith('text/')) {
          aiPrompt += `\n\nFile content (${file.name}):\n${fileContent}`;
        } else if (file.type.startsWith('image/')) {
          aiPrompt += `\n\nI've attached an image file: ${file.name}. Please analyze it if possible.`;
        } else {
          aiPrompt += `\n\nI've attached a file: ${file.name} (${file.type})`;
        }
      }

      if (toolResult && toolResult.success) {
        aiPrompt += `\n\nTool Result from ${toolId}:\n${JSON.stringify(toolResult.data, null, 2)}`;
      }
      
      const response = await aiService.generateResponse([
        ...conversationHistory.slice(0, -1),
        { ...userMessage, content: aiPrompt }
      ]);
      
      const novaResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'nova',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, novaResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('API key') || errorMessage.includes('401')) {
        setHasApiKey(false);
        setShowApiDialog(true);
        toast({
          title: "API Key Issue",
          description: "Please check your API key and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to get AI response: ${errorMessage}`,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSet = (providerId: string, key: string, model?: string) => {
    console.log('Setting provider and API key:', providerId, 'with model:', model);
    aiService.setProvider(providerId, model);
    aiService.setApiKey(key);
    setHasApiKey(true);
    
    const provider = aiService.getProvider();
    toast({
      title: "Connected Successfully!",
      description: `Nova is now powered by ${provider?.name || 'AI'}. Your API key has been saved securely.`,
    });
  };

  const handleVoiceResult = (transcript: string) => {
    setInputValue(transcript);
    handleSendMessage(transcript);
  };

  const currentProvider = aiService.getProvider();
  const currentModel = aiService.getCurrentModel();
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader
          hasMessages={hasMessages}
          hasApiKey={hasApiKey}
          currentProvider={currentProvider}
          currentModel={currentModel}
          userAvatar={userAvatar}
          onNewChat={handleNewChat}
          onShowApiDialog={() => setShowApiDialog(true)}
          onShowProfileDialog={() => setShowProfileDialog(true)}
          onShowSearch={() => setShowSearchDialog(true)}
          onShowExport={currentChat ? () => setShowExportDialog(true) : undefined}
        />

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          {!hasMessages ? (
            <ChatWelcome />
          ) : (
            <ChatContainer
              messages={messages}
              isLoading={isLoading}
              userAvatar={userAvatar}
              aiAvatar={aiAvatar}
              messagesEndRef={messagesEndRef}
              inputValue={inputValue}
              setInputValue={setInputValue}
              hasApiKey={hasApiKey}
              isListening={isListening}
              setIsListening={setIsListening}
              onSendMessage={handleSendMessage}
              onVoiceResult={handleVoiceResult}
              onShowToolsDialog={() => setShowToolsDialog(true)}
              inputRef={inputRef}
            />
          )}
        </div>
      </div>

      <AIProviderDialog
        open={showApiDialog}
        onOpenChange={setShowApiDialog}
        onProviderSet={handleProviderSet}
        currentProvider={aiService.getProvider()?.id}
      />

      <UserProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        currentUserAvatar={userAvatar}
        currentAiAvatar={aiAvatar}
        onUserAvatarChange={handleUserAvatarChange}
        onAiAvatarChange={handleAiAvatarChange}
      />

      <ToolsDialog
        open={showToolsDialog}
        onOpenChange={setShowToolsDialog}
      />

      <ChatSearch
        open={showSearchDialog}
        onOpenChange={setShowSearchDialog}
        onSelectChat={handleSelectChat}
      />

      {currentChat && (
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          chat={currentChat}
        />
      )}
    </div>
  );
};
