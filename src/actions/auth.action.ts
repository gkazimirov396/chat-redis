'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import redis from '@/lib/redis';

export async function checkAuthStatus() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (!user) return false;

  const userId = `user:${user.id}`;

  const existingUser = await redis.hgetall(userId);

  if (!existingUser || Object.keys(existingUser).length === 0) {
    const imgIsNull = user.picture?.includes('gravatar');
    const image = imgIsNull ? '' : user.picture;

    await redis.hset(userId, {
      id: user.id,
      email: user.email,
      name: `${user.given_name} ${user.family_name}`.trim(),
      image,
    });
  }

  return true;
}
