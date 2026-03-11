'use client';

import { type PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { SettingsContext } from './context';

export function SettingsContextProvider({
  children,
  userId,
  handle,
  host,
}: PropsWithChildren<{ userId: string; handle: string; host: string }>) {
  const pathname = usePathname();

  const value = {
    pathname,
    userId,
    handle,
    host,
  };

  return <SettingsContext value={value}>{children}</SettingsContext>;
}
