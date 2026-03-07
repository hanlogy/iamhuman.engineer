'use server';

import {
  CodeMismatchException,
  ExpiredCodeException,
  LimitExceededException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
  type ErrorCode,
} from '@hanlogy/react-kit';
import { getCognitoHelper } from '@/server/getCognitoHelper';

export async function resendSignUpConfirmationCode({
  email,
}: {
  email: string;
}): Promise<ActionResponse> {
  const cognito = getCognitoHelper();
  try {
    await cognito.resendConfirmationCode({
      username: email,
    });
    return toActionSuccess();
  } catch {
    return toActionFailure();
  }
}

export async function confirmSignUp({
  email,
  code,
}: {
  email: string;
  code?: string;
}): Promise<ActionResponse> {
  if (!code) {
    return toActionFailure();
  }

  const cognito = getCognitoHelper();

  try {
    await cognito.confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    return toActionSuccess();
  } catch (error) {
    let code: ErrorCode = 'unknown';

    if (error instanceof CodeMismatchException) {
      code = 'codeMismatch';
    } else if (error instanceof LimitExceededException) {
      code = 'limitExceeded';
    } else if (error instanceof ExpiredCodeException) {
      code = 'expiredCode';
    }

    return toActionFailure({ code });
  }
}
