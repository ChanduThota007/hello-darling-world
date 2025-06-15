
import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingIndicator: React.FC = () => {
  return (
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
  );
};
