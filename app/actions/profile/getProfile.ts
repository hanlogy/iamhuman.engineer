'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import type { Profile } from '@/definitions';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';

export async function getProfile({
  handle,
}: {
  handle: string;
}): Promise<ActionResponse<Profile>> {
  const profileHelper = new ProfileHelper();
  const profile = await profileHelper.getItem({ handle });

  if (!profile) {
    return toActionFailure({ code: 'notFound' });
  }

  return toActionSuccess(profile);
}
