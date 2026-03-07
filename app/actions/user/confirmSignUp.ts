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
import { deleteUserToConfirm } from '@/server/confirmSignUpManager';
import { getCognitoHelper } from '@/server/getCognitoHelper';

export async function confirmSignUp({
  email,
  code,
}: Partial<{
  email: string;
  code: string;
}>): Promise<ActionResponse> {
  if (!code || !email) {
    return toActionFailure();
  }

  const cognito = getCognitoHelper();

  try {
    await cognito.confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    await deleteUserToConfirm();
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
