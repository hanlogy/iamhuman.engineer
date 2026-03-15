import { USER_KEY } from '@/definitions';
import { createSessionManager } from '@/server/auth/createSessionManager';
import { createCookieHelper } from '@/server/createCookieHelper';
import { getCognitoHelper } from '@/server/helpersRepo';

export async function handleSession({
  setCookie,
  cookieStore,
}: Pick<
  Awaited<ReturnType<typeof createCookieHelper>>,
  'setCookie' | 'cookieStore'
>): Promise<{ handle: string; isLoggedIn: boolean } | undefined> {
  const { destroySession, getSession, setSession } = await createSessionManager(
    { cookieStore }
  );

  const session = await getSession();
  if (!session) {
    return;
  }

  const { payload, expiresAt } = session;
  const { accessToken: handleSessionLike, refreshToken, user } = payload;

  const cognitoHelper = getCognitoHelper();
  const { error } = await cognitoHelper.verifyAccessToken(handleSessionLike);

  if (error) {
    if (error.code !== 'expired') {
      destroySession();
      return;
    }

    const { accessToken } =
      (await cognitoHelper.refreshToken({
        refreshToken,
      })) ?? {};

    if (!accessToken) {
      destroySession();
      return;
    }

    await setSession({ ...payload, accessToken }, expiresAt);

    const { sub } = cognitoHelper.decodeAccessToken(accessToken) ?? {};
    if (!sub) {
      destroySession();
      return;
    }
  } else {
  }

  setCookie(USER_KEY, JSON.stringify(user));
  return { handle: user.handle, isLoggedIn: true };
}
