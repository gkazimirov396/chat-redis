'use client';

import { useSound } from 'use-sound';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ThemeToggler({
  soundEnabled,
}: {
  soundEnabled: boolean;
}) {
  const { theme, setTheme } = useTheme();

  const [playMouseClick] = useSound('/sounds/mouse-click.mp3');

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        if (soundEnabled) playMouseClick();
      }}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
