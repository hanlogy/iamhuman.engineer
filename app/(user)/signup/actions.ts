'use server';

import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import {
  type ActionResponse,
  type ErrorCode,
  toActionFailure,
} from '@hanlogy/react-kit';
import { redirect } from 'next/navigation';
import { signUpUserKey } from '@/definitions';
import { createCookieManager } from '@/server/createCookieManager';
import { getCognitoHelper } from '@/server/getCognitoHelper';

export async function signup({
  email,
  password,
  region,
  name,
}: Partial<{
  email: string;
  password: string;
  region: string;
  name: string;
}>): Promise<ActionResponse> {
  if (!email || !password || !region || !name) {
    return toActionFailure();
  }

  const client = getCognitoHelper();

  try {
    await client.signUp({
      username: email,
      password,
    });

    const { setHttpOnlyCookie } = await createCookieManager();

    await setHttpOnlyCookie({
      name: signUpUserKey,
      value: JSON.stringify({ email, region, name }),
    });
  } catch (e) {
    let code: ErrorCode = 'unknown';

    if (e instanceof UsernameExistsException) {
      code = 'usernameExists';
    }

    return toActionFailure({ code });
  }

  redirect('/signup/confirm');
}
