'use server';

import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import {
  type ActionResponse,
  type ErrorCode,
  toActionFailure,
} from '@hanlogy/react-kit';
import { redirect } from 'next/navigation';
import { setUserToConfirm } from '@/server/confirmSignUpManager';
import { getCognitoHelper } from '@/server/helpersRepo';

export async function signup({
  email,
  password,
}: Partial<{
  email: string;
  password: string;
  name: string;
}>): Promise<ActionResponse> {
  if (!email || !password) {
    return toActionFailure();
  }

  const cognito = getCognitoHelper();

  try {
    await cognito.signUp({
      username: email,
      password,
    });

    await setUserToConfirm({ email, password, from: 'signup' });
  } catch (e) {
    let code: ErrorCode = 'unknown';

    if (e instanceof UsernameExistsException) {
      code = 'usernameExists';
    }

    return toActionFailure({ code });
  }

  redirect('/signup/confirm');
}
