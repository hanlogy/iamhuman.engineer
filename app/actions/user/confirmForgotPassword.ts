'use server';

import {
  CodeMismatchException,
  ExpiredCodeException,
  InvalidPasswordException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
  type ErrorCode,
} from '@hanlogy/react-kit';
import { redirect } from 'next/navigation';
import { setUserToConfirm } from '@/server/confirmSignUpManager';
import { getCognitoHelper } from '@/server/helpersRepo';

export async function confirmForgotPassword({
  email,
  code,
  password,
}: {
  email: string;
  code: string;
  password: string;
}): Promise<ActionResponse> {
  const cognitoHelper = getCognitoHelper();

  try {
    await cognitoHelper.confirmForgotPassword({
      username: email,
      confirmationCode: code,
      password: password,
    });

    return toActionSuccess();
  } catch (error) {
    let code: ErrorCode = 'unknown';

    if (error instanceof UserNotFoundException) {
      code = 'userNotFound';
    } else if (error instanceof UserNotConfirmedException) {
      code = 'userNotConfirmed';
      await setUserToConfirm({ email, password, from: 'login' });
      redirect('/signup/confirm');
    } else if (error instanceof ExpiredCodeException) {
      code = 'expiredCode';
    } else if (error instanceof InvalidPasswordException) {
      code = 'invalidPassword';
    } else if (error instanceof CodeMismatchException) {
      code = 'codeMismatch';
    }

    return toActionFailure({ code });
  }
}
