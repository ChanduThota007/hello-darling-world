
import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface VoiceHandlerProps {
  onSpeechResult: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export const VoiceHandler: React.FC<VoiceHandlerProps> = ({ 
  onSpeechResult, 
  isListening, 
  setIsListening 
}) => {
  const [isSupported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive"
      });
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input:', transcript);
        onSpeechResult(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: event.error,
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  }, [isSupported, onSpeechResult, setIsListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={isListening ? "destructive" : "ghost"}
              onClick={isListening ? stopListening : startListening}
              disabled={!isSupported}
              className={`h-10 w-10 transition-all duration-300 ${
                isListening 
                  ? 'scale-110 animate-pulse' 
                  : 'hover:scale-105 hover:bg-accent'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isListening ? "Stop Voice Input" : "Voice Input"}</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => speak("Hello, I'm Nova, your AI assistant.")}
              className="h-10 w-10 transition-all duration-200 hover:scale-105 hover:bg-accent"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice Mode</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
