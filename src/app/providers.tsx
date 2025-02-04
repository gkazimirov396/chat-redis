'use client';

import type { ComponentProps, ReactNode } from 'react';

import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();

    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <KindeProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </KindeProvider>
    </QueryClientProvider>
  );
}

function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
