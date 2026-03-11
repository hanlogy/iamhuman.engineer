import { HANDLE_KEY, USER_ID_KEY } from '@/definitions';
import { createSessionManager } from '@/server/auth/createSessionManager';
import { createCookieHelper } from '@/server/createCookieHelper';
import { getCognitoHelper } from '@/server/getCognitoHelper';

export async function handleSession({
  setCookie,
  cookieStore,
}: Pick<
  Awaited<ReturnType<typeof createCookieHelper>>,
  'setCookie' | 'cookieStore'
>): Promise<{ handle: string } | undefined> {
  const { destroySession, getSession, setSession } = await createSessionManager(
    { cookieStore }
  );

  const session = await getSession();
  if (!session) {
    destroySession();
    return;
  }

  const { accessToken: handleSessionLike, refreshToken, handle } = session;
  const cognitoHelper = getCognitoHelper();
  const { payload, error } =
    await cognitoHelper.verifyAccessToken(handleSessionLike);

  let userId: string;
  if (error) {
    if (error.code !== 'expired') {
      destroySession();
      return;
    }

    const { accessToken, expiresIn } =
      (await cognitoHelper.refreshToken({
        refreshToken,
      })) ?? {};

    if (!accessToken || !expiresIn) {
      destroySession();
      return;
    }

    await setSession({ accessToken, expiresIn, refreshToken, handle });

    const { sub } = cognitoHelper.decodeAccessToken(accessToken) ?? {};
    if (!sub) {
      destroySession();
      return;
    }
    userId = sub;
  } else {
    userId = payload.sub;
  }

  setCookie(USER_ID_KEY, userId);
  setCookie(HANDLE_KEY, handle);
  return { handle };
}
