
import React, { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatContainer } from './ChatContainer';
import { AIProviderDialog } from './AIProviderDialog';
import { UserProfileDialog } from './UserProfileDialog';
import { ChatWelcome } from './ChatWelcome';
import { toast } from '@/hooks/use-toast';
import { aiService } from '@/services/aiService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'nova';
  timestamp: Date;
}

export const NovaChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [aiAvatar, setAiAvatar] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    if (!hasApiKey) {
      setShowApiDialog(true);
      toast({
        title: "API Key Required",
        description: "Please connect to an AI provider first to start chatting.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].slice(-10); // Keep last 10 messages for context
      console.log('Sending to AI service:', conversationHistory);
      const response = await aiService.generateResponse(conversationHistory);
      
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
            />
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          hasApiKey={hasApiKey}
          isListening={isListening}
          setIsListening={setIsListening}
          onSendMessage={handleSendMessage}
          onVoiceResult={handleVoiceResult}
        />
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
    </div>
  );
};
