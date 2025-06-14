
import React from 'react';
import { NovaChat } from '@/components/NovaChat';
import { ThemeProvider } from '@/components/ThemeProvider';

const Index = () => {
  return (
    <ThemeProvider>
      <NovaChat />
    </ThemeProvider>
  );
};

export default Index;
