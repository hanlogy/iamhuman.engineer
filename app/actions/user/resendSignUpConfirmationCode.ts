'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
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
