'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { createSessionManager } from '@/server/auth';

export async function saveLinks({
  links,
}: {
  links: string[];
}): Promise<ActionResponse> {
  const { getSession } = await createSessionManager();

  const session = await getSession({ checkDb: true });
  if (!session) {
    return toActionFailure();
  }

  const { handle } = session;

  const profileHelper = new ProfileHelper();

  try {
    await profileHelper.saveLinks({ handle, links });

    return toActionSuccess();
  } catch {
    return toActionFailure();
  }
}
