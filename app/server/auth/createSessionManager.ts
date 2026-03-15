import { HANDLE_KEY, SESSION_KEY, USER_ID_KEY } from '@/definitions';
import { createCookieHelper, type CookieStore } from '../createCookieHelper';
import { createEncryptedJwt, decryptJwt } from '../jwt';
import { sessionAgeInSeconds, type SessionPayload } from './definitions';
import { getSecretHex } from './getSecretHex';

export async function createSessionManager({
  cookieStore,
}: {
  cookieStore?: CookieStore;
} = {}) {
  const { getCookie, setCookie, deleteCookie } =
    await createCookieHelper(cookieStore);

  const getRawSession = () => {
    return getCookie(SESSION_KEY);
  };

  const hasSession = (): boolean => {
    return !!getRawSession();
  };

  const destroySession = () => {
    deleteCookie(SESSION_KEY);
    deleteCookie(USER_ID_KEY);
    deleteCookie(HANDLE_KEY);
  };

  const getSession = async (): Promise<SessionPayload | null> => {
    const session = getRawSession();

    if (!session) {
      return null;
    }

    const data = await decryptJwt({
      token: session,
      secretHex: getSecretHex(),
    });

    if (!data) {
      return null;
    }

    const { accessToken, refreshToken, handle } = data;
    if (
      typeof accessToken !== 'string' ||
      typeof refreshToken !== 'string' ||
      typeof handle !== 'string'
    ) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      handle,
    };
  };

  const setSession = async (
    payload: Readonly<SessionPayload>
  ): Promise<void> => {
    const encryptedSession = await createEncryptedJwt({
      payload,
      secretHex: getSecretHex(),
      expiresIn: sessionAgeInSeconds,
    });

    setCookie(SESSION_KEY, encryptedSession, {
      maxAge: sessionAgeInSeconds,
    });
  };

  const updateHandle = async (handle: string): Promise<void> => {
    const payload = await getSession();
    if (!payload) {
      throw new Error('Unknown error');
    }

    await setSession({
      ...payload,
      handle,
    });
  };

  return {
    hasSession,
    destroySession,
    updateHandle,
    setSession,
    getSession,
  };
}
