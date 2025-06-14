
import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ] as const;

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          size="sm"
          variant={theme === value ? "default" : "ghost"}
          onClick={() => setTheme(value)}
          className="h-8 w-8 p-0"
          title={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};
