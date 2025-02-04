/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import useSound from 'use-sound';
import { Volume2, VolumeX } from 'lucide-react';

import { usePreferences } from '@/store/preferences';

import ThemeToggler from './ThemeToggler';

import { Button } from './ui/button';

export default function PreferencesTab() {
  const { soundEnabled, toggleSoundEnabled } = usePreferences();

  const [playSoundOn] = useSound('/sounds/sound-on.mp3', { volume: 0.3 });
  const [playSoundOff] = useSound('/sounds/sound-off.mp3', { volume: 0.3 });

  return (
    <div className="flex flex-wrap gap-2 px-1 md:px-2">
      <ThemeToggler soundEnabled={soundEnabled} />

      <Button
        size="icon"
        variant="outline"
        onClick={() => {
          toggleSoundEnabled();
          soundEnabled ? playSoundOff() : playSoundOn();
        }}
      >
        {soundEnabled ? (
          <Volume2 className="size-[1.2rem] text-muted-foreground" />
        ) : (
          <VolumeX className="size-[1.2rem] text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
