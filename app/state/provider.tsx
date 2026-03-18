'use client';

import { type PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import type { UserSummary } from '@/definitions';
import { AppContext } from './context';

export function AppContextProvider({
  children,
  host,
  user,
}: PropsWithChildren<{
  host: string;
  user: UserSummary | undefined;
}>) {
  const pathname = usePathname();

  const value = user
    ? ({
        isLoggedIn: true,
        pathname,
        host,
        user,
      } as const)
    : ({
        isLoggedIn: false,
        pathname,
        host,
        user: undefined,
      } as const);

  return <AppContext value={value}>{children}</AppContext>;
}
