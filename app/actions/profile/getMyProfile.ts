'use server';

import { toActionFailure, type ActionResponse } from '@hanlogy/react-kit';
import type { Profile } from '@/definitions';
import { createSessionManager } from '@/server/auth/createSessionManager';
import { getProfile } from './getProfile';

export async function getMyProfile(): Promise<ActionResponse<Profile>> {
  const { getSession } = await createSessionManager();
  const { handle } = (await getSession()) ?? {};

  if (!handle) {
    return toActionFailure({ code: 'unauthorized' });
  }

  return getProfile({ handle });
}
