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
import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCognitoHelper } from '@/server/getCognitoHelper';
import { setSession } from '@/server/session';
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

    await setSession({ accessToken, refreshToken, expiresIn });
    refresh();
    return toActionSuccess();
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
}
