'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import redis from '@/lib/redis';
import { pusherServer } from '@/lib/pusher';
import { getConversationId } from '@/lib/utils';

import type { Message } from '@/types/db';

export async function getMessages(
  selectedUserId: string,
  currentUserId: string
) {
  const conversationId = getConversationId(selectedUserId, currentUserId);

  const messageIds = await redis.zrange<string[]>(
    `${conversationId}:messages`,
    0,
    -1
  );
  if (messageIds.length === 0) return [];

  const pipeline = redis.pipeline();

  messageIds.forEach(messageId => pipeline.hgetall(messageId));
  const messages: Message[] = await pipeline.exec();

  return messages;
}

type SendMessageActionArgs = {
  content: string;
  receiverId: string;
  messageType: 'text' | 'image';
};

export async function sendMessage({
  content,
  receiverId,
  messageType,
}: SendMessageActionArgs) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return { success: false, message: 'User not authenticated' };

  const senderId = user.id;
  const conversationId = getConversationId(receiverId, senderId);

  const conversationExists = await redis.exists(conversationId);

  if (!conversationExists) {
    await redis.hset(conversationId, {
      participant1: senderId,
      participant2: receiverId,
    });

    await redis.sadd(`user:${senderId}:conversations`, conversationId);
    await redis.sadd(`user:${receiverId}:conversations`, conversationId);
  }

  const timestamp = Date.now();
  const messageId = `message:${timestamp}:${crypto.randomUUID()}`;

  await redis.hset(messageId, {
    senderId,
    content,
    timestamp,
    messageType,
  });

  await redis.zadd(`${conversationId}:messages`, {
    score: timestamp,
    member: JSON.stringify(messageId),
  });

  const channelName = `${senderId}__${receiverId}`
    .split('__')
    .sort()
    .join('__');

  await pusherServer?.trigger(channelName, 'newMessage', {
    message: { senderId, content, timestamp, messageType },
  });

  return { success: true, conversationId, messageId };
}
