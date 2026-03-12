'use client';

import { type PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { AppContext } from './context';

export function AppContextProvider({
  children,
  userId,
  handle,
  host,
}: PropsWithChildren<{
  userId: string | undefined;
  handle: string | undefined;
  host: string;
}>) {
  const pathname = usePathname();

  const value =
    userId && handle
      ? ({
          isLoggedIn: true,
          pathname,
          host,
          userId,
          handle,
        } as const)
      : ({
          isLoggedIn: false,
          pathname,
          host,
          userId: undefined,
          handle: undefined,
        } as const);

  return <AppContext value={value}>{children}</AppContext>;
}
