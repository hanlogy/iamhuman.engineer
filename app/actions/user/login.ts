'use server';

import {
  NotAuthorizedException,
  PasswordResetRequiredException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  toActionFailure,
  type ActionResponse,
  type ErrorCode,
} from '@hanlogy/react-kit';
import { shiftDate } from '@hanlogy/ts-lib';
import { redirect } from 'next/navigation';
import { ProfileLookUpHelper } from '@/dynamodb/ProfileLookUpHelper';
import { setSession } from '@/server/auth';
import { getUserIdFromAccessToken } from '@/server/auth/getUserIdFromAccessToken';
import { getCognitoHelper } from '@/server/getCognitoHelper';
import { setUserToConfirm } from '../../server/confirmSignUpManager';

export async function login({
  email,
  password,
}: Partial<{
  email: string;
  password: string;
}>): Promise<ActionResponse> {
  if (!email || !password) {
    return toActionFailure();
  }

  const cognito = getCognitoHelper();

  try {
    const { accessToken, refreshToken, expiresIn } = await cognito.login({
      username: email,
      password,
    });

    if (!accessToken || !refreshToken || !expiresIn) {
      return toActionFailure({
        message: 'Invalid response from login',
      });
    }

    const dbHelper = new ProfileLookUpHelper();
    const userId = getUserIdFromAccessToken(accessToken);
    if (!userId) {
      return toActionFailure({
        message: 'Failed to extract user id from accessToken',
      });
    }

    await setSession({
      accessToken,
      refreshToken,
      expiresAt: shiftDate({ seconds: expiresIn }).getTime(),
      handle: await dbHelper.getHandleByUserId(userId),
    });
  } catch (error) {
    let code: ErrorCode = 'unknown';
    if (error instanceof UserNotConfirmedException) {
      await setUserToConfirm({ email, password, from: 'login' });
      redirect('/signup/confirm');
    } else if (error instanceof UserNotFoundException) {
      code = 'userNotFound';
    } else if (error instanceof NotAuthorizedException) {
      code = 'notAuthorized';
    } else if (error instanceof PasswordResetRequiredException) {
      code = 'passwordResetRequired';
    }

    return toActionFailure({ code });
  }

  redirect('/');
}
