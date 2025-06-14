
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { VoiceHandler } from './VoiceHandler';
import { ThemeToggle } from './ThemeToggle';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'nova';
  timestamp: Date;
}

export const NovaChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Nova, your personal AI assistant. How can I help you today?",
      sender: 'nova',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

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
      // Simulate AI response for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novaResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${content}". This is a placeholder response while we set up the AI backend. I'm ready to help you with tasks, questions, and conversations!`,
        sender: 'nova',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, novaResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setInputValue(transcript);
    handleSendMessage(transcript);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Nova</h1>
              </div>
              <div className="text-sm text-muted-foreground">
                Your Personal AI Assistant
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-4 h-full">
          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2 text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message or use voice input..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <VoiceHandler
              onSpeechResult={handleVoiceResult}
              isListening={isListening}
              setIsListening={setIsListening}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
