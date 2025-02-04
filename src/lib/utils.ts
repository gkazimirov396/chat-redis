import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function playRandomKeyStrokeSound(
  soundEnabled: boolean,
  playSoundFunctions: (() => void)[]
) {
  const randomIndex = Math.floor(Math.random() * playSoundFunctions.length);

  if (soundEnabled) playSoundFunctions[randomIndex]();
}

export function getConversationId(senderId: string, receiverId: string) {
  const conversationId = `conversation:${[senderId, receiverId]
    .sort()
    .join(':')}`;

  return conversationId;
}
