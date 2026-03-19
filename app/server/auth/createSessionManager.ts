import {
  SESSION_AGE,
  SESSION_KEY,
  type SessionCookiePayload,
  type UserSummary,
} from '@/definitions';
import { SessionHelper } from '@/dynamodb/SessionHelper';
import { createCookieHelper, type CookieStore } from '../createCookieHelper';
import { getCognitoHelper } from '../helpersRepo';

export async function createSessionManager({
  cookieStore,
}: {
  cookieStore?: CookieStore;
} = {}) {
  const { getCookie, setCookie, deleteCookie } =
    await createCookieHelper(cookieStore);

  const getRawSession = () => getCookie(SESSION_KEY);

  const hasSession = (): boolean => !!getRawSession();

  const destroySession = () => deleteCookie(SESSION_KEY);

  const getSession = async (options?: {
    checkDb?: boolean;
  }): Promise<SessionCookiePayload | undefined> => {
    const raw = getRawSession();
    if (!raw) return undefined;

    try {
      const session = JSON.parse(raw) as SessionCookiePayload;

      if (!options?.checkDb) {
        return session;
      }

      const record = await new SessionHelper().getItem(session.sessionId);

      if (!record) {
        destroySession();
        return undefined;
      }

      return session;
    } catch {
      return undefined;
    }
  };

  const setSession = (
    payload: Omit<SessionCookiePayload, 'expiresAt'>,
    /**
     * **CAUTION**: It is in seconds, not ms.
     */
    expiresIn: number = SESSION_AGE
  ): void => {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
    setCookie(SESSION_KEY, JSON.stringify({ ...payload, expiresAt }), {
      maxAge: expiresIn,
    });
  };

  const updateSession = async (
    updater: (
      current: SessionCookiePayload
    ) => Omit<SessionCookiePayload, 'expiresAt'>
  ): Promise<void> => {
    const session = await getSession({ checkDb: true });
    if (!session) {
      throw new Error('You have not logged in');
    }

    const expiresIn = Math.floor(session.expiresAt - Date.now() / 1000);
    if (expiresIn <= 0) {
      throw new Error('Session has expired');
    }

    setSession(updater(session), expiresIn);
  };

  const getAccessToken = async (): Promise<string | null> => {
    const session = await getSession({ checkDb: true });
    if (!session) {
      return null;
    }

    const sessionHelper = new SessionHelper();
    const tokens = await sessionHelper.getItem(session.sessionId);
    if (!tokens) {
      destroySession();
      return null;
    }

    const cognitoHelper = getCognitoHelper();
    const { isValid, error } = await cognitoHelper.verifyAccessToken(
      tokens.accessToken
    );

    if (isValid) {
      return tokens.accessToken;
    }

    if (error.code !== 'expired') {
      destroySession();
      return null;
    }

    const refreshed = await cognitoHelper.refreshToken({
      refreshToken: tokens.refreshToken,
    });

    if (!refreshed?.accessToken) {
      destroySession();
      return null;
    }

    await sessionHelper.updateAccessToken(
      session.sessionId,
      refreshed.accessToken
    );
    return refreshed.accessToken;
  };

  const updateUser = async ({
    avatar,
    handle,
  }: Partial<Pick<UserSummary, 'avatar' | 'handle'>>): Promise<void> => {
    await updateSession((current) => ({
      ...current,
      ...(handle ? { handle } : {}),
      ...(avatar !== undefined ? { avatar } : {}),
    }));
  };

  return {
    hasSession,
    destroySession,
    getAccessToken,
    updateUser,
    setSession,
    getSession,
  };
}
