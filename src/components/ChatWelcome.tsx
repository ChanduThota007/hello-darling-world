
import React from 'react';
import { Sparkles } from 'lucide-react';

export const ChatWelcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Nova</h1>
        </div>
        <h2 className="text-2xl text-muted-foreground mb-8">What can I help with?</h2>
      </div>
      
      {/* Suggestions could go here in the future */}
      <div className="w-full max-w-2xl">
        {/* This is where the input will be rendered from the parent component */}
      </div>
    </div>
  );
};
