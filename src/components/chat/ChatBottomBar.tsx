'use client';

import { Loader, SendHorizontal, ThumbsUp } from 'lucide-react';
import { useRef, useState, useEffect, type KeyboardEvent } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import useSound from 'use-sound';

import { sendMessage as sendMessageAction } from '@/actions/message.action';

import { usePreferences } from '@/store/preferences';
import { useSelectedUser } from '@/store/selected-user';

import { pusherClient } from '@/lib/pusher';
import { playRandomKeyStrokeSound } from '@/lib/utils';

import ImageUpload from './ImageUpload';
import EmojiPicker from '@/components/chat/EmojiPicker';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

import type { Message } from '@/types/db';

export default function ChatBottomBar() {
  const [message, setMessage] = useState('');

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const soundEnabled = usePreferences(state => state.soundEnabled);
  const selectedUser = useSelectedUser(state => state.selectedUser);

  const queryClient = useQueryClient();
  const { user: currentUser } = useKindeBrowserClient();
  const { mutate: sendMessage, isPending } = useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: sendMessageAction,
    onSuccess: () => {
      setMessage('');

      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    },
  });

  const [playSound1] = useSound('/sounds/keystroke1.mp3');
  const [playSound2] = useSound('/sounds/keystroke2.mp3');
  const [playSound3] = useSound('/sounds/keystroke3.mp3');
  const [playSound4] = useSound('/sounds/keystroke4.mp3');

  const [playNotificationSound] = useSound('/sounds/notification.mp3');

  const playSoundFunctions = [playSound1, playSound2, playSound3, playSound4];

  useEffect(() => {
    const channelName = `${currentUser?.id}__${selectedUser?.id}`
      .split('__')
      .sort()
      .join('__');
    const channel = pusherClient?.subscribe(channelName);

    const handleNewMessage = (data: { message: Message }) => {
      queryClient.setQueryData(
        ['messages', selectedUser?.id],
        (oldMessages: Message[]) => {
          return [...oldMessages, data.message];
        }
      );

      if (soundEnabled && data.message.senderId !== currentUser?.id) {
        playNotificationSound();
      }
    };

    channel.bind('newMessage', handleNewMessage);

    return () => {
      channel.unbind('newMessage', handleNewMessage);
      pusherClient.unsubscribe(channelName);
    };
  }, [
    currentUser?.id,
    queryClient,
    selectedUser?.id,
    soundEnabled,
    playNotificationSound,
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage({
      content: message,
      messageType: 'text',
      receiverId: selectedUser!.id,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      handleSendMessage();
    }

    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();

      setMessage(message + '\n');
    }
  };

  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      <ImageUpload canSendImage={message.trim() === ''} />

      <AnimatePresence>
        <motion.div
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            layout: {
              type: 'spring',
              bounce: 0.15,
            },
          }}
          className="w-full relative"
        >
          <Textarea
            rows={1}
            value={message}
            placeholder="Aa"
            ref={textAreaRef}
            autoComplete="off"
            onKeyDown={handleKeyDown}
            className="w-full border rounded-full flex items-center h-9 resize-none overflow-hidden
						bg-background min-h-0"
            onChange={e => {
              setMessage(e.target.value);
              playRandomKeyStrokeSound(soundEnabled, playSoundFunctions);
            }}
          />

          <div className="absolute right-2 bottom-0.5">
            <EmojiPicker
              onChange={emoji => {
                setMessage(message + emoji);

                if (textAreaRef.current) {
                  textAreaRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            onClick={handleSendMessage}
            variant="ghost"
            size="icon"
          >
            <SendHorizontal size={20} className="text-muted-foreground" />
          </Button>
        ) : (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={() => {
              sendMessage({
                content: '👍',
                messageType: 'text',
                receiverId: selectedUser!.id,
              });
            }}
          >
            {isPending ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <ThumbsUp size={20} className="text-muted-foreground" />
            )}
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}
