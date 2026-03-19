'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import { createSessionManager } from '@/server/auth';
import { getCognitoHelper } from '@/server/helpersRepo';

export async function updateUserAttributes({
  email,
}: {
  email: string;
}): Promise<ActionResponse> {
  const { getAccessToken } = await createSessionManager();

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return toActionFailure();
  }

  const cognitoHelper = getCognitoHelper();

  try {
    // NOTE: We only support change email now
    await cognitoHelper.updateUserAttributes({
      attributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
      accessToken,
    });

    return toActionSuccess();
  } catch {
    return toActionFailure();
  }
}
