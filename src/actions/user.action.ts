'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import redis from '@/lib/redis';

import type { User } from '@/types/db';

export async function getUsers(): Promise<User[]> {
  const userIds: string[] = [];
  let cursor = '0';

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: 'user:*',
      type: 'hash',
      count: 100,
    });

    cursor = nextCursor;
    userIds.push(...keys);
  } while (cursor !== '0');

  const { getUser } = getKindeServerSession();
  const currentUser = await getUser();

  const pipeline = redis.pipeline();
  userIds.forEach(userId => pipeline.hgetall(userId));

  const results: User[] = await pipeline.exec();
  const users = results.filter(user => user.id !== currentUser?.id);

  return users;
}
