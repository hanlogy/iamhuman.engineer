'use server';

import {
  NotAuthorizedException,
  PasswordResetRequiredException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
  type ErrorCode,
} from '@hanlogy/react-kit';
import { SessionHelper } from '@/dynamodb/SessionHelper';
import { UserHelper } from '@/dynamodb/UserHelper';
import { createSessionManager } from '@/server/auth/createSessionManager';
import { getCognitoHelper } from '@/server/helpersRepo';
import { setUserToConfirm } from '../../server/confirmSignUpManager';

export async function login({
  email,
  password,
}: Partial<{
  email: string;
  password: string;
}>): Promise<ActionResponse<{ handle: string }>> {
  if (!email || !password) {
    return toActionFailure();
  }

  const cognito = getCognitoHelper();

  try {
    const { accessToken, refreshToken } = await cognito.login({
      username: email,
      password,
    });

    if (!accessToken || !refreshToken) {
      return toActionFailure({
        message: 'Invalid response from login',
      });
    }

    const { sub: userId } = cognito.decodeAccessToken(accessToken) ?? {};
    if (!userId) {
      return toActionFailure({
        message: 'Failed to extract user id from accessToken',
      });
    }

    const userHelper = new UserHelper();
    const user = await userHelper.getOrCreateSummary(userId);

    const sessionHelper = new SessionHelper();
    const { sessionId } = await sessionHelper.createItem({
      userId,
      accessToken,
      refreshToken,
    });

    const { setSession } = await createSessionManager();
    setSession({ sessionId, ...user });

    return toActionSuccess({ handle: user.handle });
  } catch (error) {
    let code: ErrorCode = 'unknown';
    if (error instanceof UserNotConfirmedException) {
      await setUserToConfirm({ email, password, from: 'login' });
      code = 'userNotConfirmed';
    } else if (error instanceof UserNotFoundException) {
      code = 'userNotFound';
    } else if (error instanceof NotAuthorizedException) {
      code = 'notAuthorized';
    } else if (error instanceof PasswordResetRequiredException) {
      code = 'passwordResetRequired';
    }

    return toActionFailure({ code });
  }
}
