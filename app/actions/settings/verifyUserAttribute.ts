'use server';

import {
  AliasExistsException,
  CodeMismatchException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
  type ErrorCode,
} from '@hanlogy/react-kit';
import { createSessionManager } from '@/server/auth';
import { getCognitoHelper } from '@/server/helpersRepo';

export async function verifyUserAttribute({
  name,
  code,
}: {
  name: 'email';
  code: string;
}): Promise<ActionResponse> {
  const { getAccessToken } = await createSessionManager();

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return toActionFailure();
  }

  const cognitoHelper = getCognitoHelper();

  try {
    // NOTE: We only support change email now
    await cognitoHelper.verifyUserAttribute({
      attributeName: name,
      code,
      accessToken,
    });

    return toActionSuccess();
  } catch (error) {
    let code: ErrorCode = 'unknown';
    if (error instanceof CodeMismatchException) {
      code = 'codeMismatch';
    } else if (error instanceof AliasExistsException) {
      code = 'aliasExists';
    }

    return toActionFailure({ code });
  }
}
