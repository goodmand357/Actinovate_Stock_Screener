
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center gap-2">
      <Sun size={16} className="text-muted-foreground" />
      <Switch 
        checked={theme === 'dark'} 
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
      <Moon size={16} className="text-muted-foreground" />
    </div>
  );
};

export default ThemeToggle;
