import type { NextRequest, NextResponse } from 'next/server';
import { HANDLE_KEY, USER_ID_KEY } from '@/definitions';
import { destroySession, getSession, setSession } from '@/server/auth';
import { getCognitoHelper } from '@/server/getCognitoHelper';

export async function handleSession(
  request: NextRequest,
  response: NextResponse
): Promise<{ handle: string } | undefined> {
  const clearCookies = (): void => {
    destroySession(response.cookies.delete);
  };

  const session = await getSession((name) => request.cookies.get(name)?.value);
  if (!session) {
    clearCookies();
    return;
  }

  const { accessToken: handleSessionLike, refreshToken, handle } = session;
  const cognitoHelper = getCognitoHelper();
  const { payload, error } =
    await cognitoHelper.verifyAccessToken(handleSessionLike);

  let userId: string;
  if (error) {
    if (error.code !== 'expired') {
      clearCookies();
      return;
    }

    const { accessToken, expiresIn } =
      (await cognitoHelper.refreshToken({
        refreshToken,
      })) ?? {};

    if (!accessToken || !expiresIn) {
      clearCookies();
      return;
    }

    await setSession(
      { accessToken, expiresIn, refreshToken, handle },
      response.cookies.set
    );

    const { sub } = cognitoHelper.decodeAccessToken(accessToken) ?? {};
    if (!sub) {
      clearCookies();
      return;
    }
    userId = sub;
  } else {
    userId = payload.sub;
  }

  response.cookies.set(USER_ID_KEY, userId);
  response.cookies.set(HANDLE_KEY, handle);
  return { handle };
}
