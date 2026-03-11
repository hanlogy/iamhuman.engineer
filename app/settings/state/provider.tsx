'use client';

import { type PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { SettingsContext } from './context';

export function SettingsContextProvider({
  children,
  userId,
  handle,
}: PropsWithChildren<{ userId: string; handle: string }>) {
  const pathname = usePathname();

  const value = {
    pathname,
    userId,
    handle,
  };

  return <SettingsContext value={value}>{children}</SettingsContext>;
}
