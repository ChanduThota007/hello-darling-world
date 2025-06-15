
import { useEffect } from 'react';

interface KeyboardShortcuts {
  onNewChat: () => void;
  onToggleTheme: () => void;
  onFocusInput: () => void;
  onShowSettings: () => void;
  onShowSearch: () => void;
}

export const useKeyboardShortcuts = ({
  onNewChat,
  onToggleTheme,
  onFocusInput,
  onShowSettings,
  onShowSearch
}: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (isCtrlOrCmd) {
        switch (event.key) {
          case 'n':
            event.preventDefault();
            onNewChat();
            break;
          case 'k':
            event.preventDefault();
            onShowSearch();
            break;
          case '/':
            event.preventDefault();
            onFocusInput();
            break;
          case ',':
            event.preventDefault();
            onShowSettings();
            break;
          case 't':
            event.preventDefault();
            onToggleTheme();
            break;
        }
      }

      // Escape key
      if (event.key === 'Escape') {
        // Close any open dialogs or focus input
        onFocusInput();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNewChat, onToggleTheme, onFocusInput, onShowSettings, onShowSearch]);
};
