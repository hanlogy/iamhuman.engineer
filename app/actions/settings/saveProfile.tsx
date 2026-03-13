'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import type { UODImage } from '@/components/ImageUpload';
import { HANDLE_KEY } from '@/definitions';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { createSessionManager } from '@/server/auth';
import { createCookieHelper } from '@/server/createCookieHelper';
import { getCognitoHelper } from '@/server/helpersRepo';

export async function saveProfile({
  name,
  handle,
  location,
  uodImage,
}: Partial<{
  name: string;
  handle: string;
  location: string;
}> & {
  uodImage: UODImage;
}): Promise<ActionResponse> {
  if (!name) {
    return toActionFailure({ message: 'Name is required' });
  }
  if (!handle) {
    return toActionFailure({ message: 'Handle is required' });
  }
  const { getSession } = await createSessionManager();

  const session = await getSession();
  if (!session) {
    return toActionFailure();
  }
  const cognitoHelper = getCognitoHelper();
  const decodedAccessToken = cognitoHelper.decodeAccessToken(
    session.accessToken
  );
  if (!decodedAccessToken) {
    return toActionFailure();
  }

  const { sub: userId } = decodedAccessToken;

  const profileHelper = new ProfileHelper();

  try {
    await profileHelper.saveProfile(userId, {
      name,
      handle,
      location,
      uodImage,
    });

    const { getCookie } = await createCookieHelper();
    if (getCookie(HANDLE_KEY) !== handle) {
      const { updateHandle } = await createSessionManager();
      await updateHandle(handle);
    }

    return toActionSuccess();
  } catch (e) {
    return toActionFailure({
      message: e instanceof Error ? e.message : undefined,
    });
  }
}
