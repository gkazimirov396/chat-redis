'use client';

import { SmileIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ onChange }: EmojiPickerProps) {
  const { theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
      </PopoverTrigger>

      <PopoverContent className="w-full">
        <Picker
          data={data}
          emojiSize={18}
          maxFrequentRows={1}
          theme={theme === 'dark' ? 'dark' : 'light'}
          onEmojiSelect={(emoji: Record<string, string>) =>
            onChange(emoji?.native as string)
          }
        />
      </PopoverContent>
    </Popover>
  );
}
