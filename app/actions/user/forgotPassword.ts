'use server';

import { UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import {
  toActionFailure,
  type ActionResponse,
  type ErrorCode,
} from '@hanlogy/react-kit';
import { redirect } from 'next/navigation';
import { FORGOT_PASSWORD_KEY } from '@/definitions';
import { createCookieHelper } from '@/server/createCookieHelper';
import { getCognitoHelper } from '@/server/helpersRepo';

export async function forgotPassword({
  email,
}: {
  email: string;
}): Promise<ActionResponse> {
  const cognitoHelper = getCognitoHelper();

  try {
    await cognitoHelper.forgotPassword({ username: email });
    const { setCookie } = await createCookieHelper();
    setCookie(FORGOT_PASSWORD_KEY, email);
  } catch (error) {
    let code: ErrorCode = 'unknown';
    if (error instanceof UserNotFoundException) {
      code = 'userNotFound';
    }
    return toActionFailure({ code });
  }

  redirect('/forgot-password/confirm');
}
