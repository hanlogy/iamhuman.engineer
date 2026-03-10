'use server';

import { redirect } from 'next/navigation';
import { destroySession } from '@/server/auth';
import { createCookieManager } from '@/server/createCookieManager';

export async function logout() {
  const cookeStore = await createCookieManager();
  destroySession(cookeStore.deleteCookie);

  redirect('/');
}
