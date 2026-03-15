'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
  type ErrorCode,
} from '@hanlogy/react-kit';
import type { UODImage } from '@/components/ImageUpload';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { DBHelperError } from '@/dynamodb/types';
import { createSessionManager } from '@/server/auth';
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
    session.payload.accessToken
  );
  if (!decodedAccessToken) {
    return toActionFailure();
  }

  const { sub: userId } = decodedAccessToken;

  const profileHelper = new ProfileHelper();

  try {
    const { changed } = await profileHelper.saveProfile(userId, {
      name,
      handle,
      location,
      uodImage,
    });

    if (changed.handle || changed.avatar !== undefined) {
      const { updateUser } = await createSessionManager();
      await updateUser(changed);
    }

    return toActionSuccess();
  } catch (e) {
    let code: ErrorCode = 'unknown';
    let message: string = '';
    if (e instanceof DBHelperError) {
      code = e.code;
      message = e.message;
    }

    if (e instanceof Error) {
      message = e.message;
    }

    return toActionFailure({
      code,
      message,
    });
  }
}
