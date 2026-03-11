'use server';

import { redirect } from 'next/navigation';
import { createSessionManager } from '@/server/auth';

export async function logout() {
  const { destroySession } = await createSessionManager();
  destroySession();

  redirect('/');
}
