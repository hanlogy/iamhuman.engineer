'use server';

import {
  InvalidPasswordException,
  LimitExceededException,
  NotAuthorizedException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
  type ErrorCode,
} from '@hanlogy/react-kit';
import { createSessionManager } from '@/server/auth';
import { getCognitoHelper } from '@/server/helpersRepo';

export async function changePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}): Promise<ActionResponse> {
  const { getSession } = await createSessionManager();

  const session = await getSession();
  if (!session) {
    return toActionFailure();
  }

  const cognitoHelper = getCognitoHelper();

  try {
    await cognitoHelper.changePassword({
      previousPassword: oldPassword,
      proposedPassword: newPassword,
      accessToken: session.payload.accessToken,
    });

    return toActionSuccess();
  } catch (error) {
    let code: ErrorCode = 'unknown';
    if (error instanceof NotAuthorizedException) {
      code = 'notAuthorized';
    } else if (error instanceof InvalidPasswordException) {
      code = 'invalidPassword';
    } else if (error instanceof LimitExceededException) {
      code = 'limitExceeded';
    }
    return toActionFailure({ code });
  }
}
