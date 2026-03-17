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
  const { getSession } = await createSessionManager();

  const session = await getSession();
  if (!session) {
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
      accessToken: session.payload.accessToken,
    });

    return toActionSuccess();
  } catch {
    return toActionFailure();
  }
}
