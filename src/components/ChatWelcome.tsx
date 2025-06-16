
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const greetings = [
  "Hello, Chandu!",
  "What can I help with?",
  "Welcome back!",
  "How can I assist today?"
];

export const ChatWelcome: React.FC = () => {
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    // Select a random greeting
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setCurrentGreeting(randomGreeting);
    
    // Trigger fade-in animation
    setTimeout(() => setShowGreeting(true), 100);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className={`flex items-center justify-center gap-2 mb-4 transition-all duration-500 ${showGreeting ? 'animate-fade-in' : 'opacity-0'}`}>
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Nova</h1>
        </div>
        <h2 className={`text-2xl text-muted-foreground mb-8 transition-all duration-700 delay-300 ${showGreeting ? 'animate-fade-in' : 'opacity-0'}`}>
          {currentGreeting}
        </h2>
      </div>
      
      <div className="w-full max-w-2xl">
        {/* This is where the input will be rendered from the parent component */}
      </div>
    </div>
  );
};
