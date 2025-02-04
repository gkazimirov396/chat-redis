'use client';

import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';

import { checkAuthStatus } from '@/actions/auth.action';

export default function AuthCallbackPage() {
  const router = useRouter();

  const { data: isAuthenticated, isSuccess } = useQuery({
    queryKey: ['auth', 'check'],
    queryFn: checkAuthStatus,
  });

  if (isAuthenticated && isSuccess) router.push('/');

  return (
    <div className="mt-20 w-full flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className="w-10 h-10 animate-spin text-muted-foreground" />
        <h3 className="text-xl font-bold">Redirecting...</h3>

        <p>Please wait</p>
      </div>
    </div>
  );
}
