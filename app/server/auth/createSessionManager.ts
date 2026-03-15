import { isPlainObject, type JsonRecord } from '@hanlogy/ts-lib';
import {
  HANDLE_KEY,
  SESSION_AGE,
  SESSION_KEY,
  USER_ID_KEY,
  type SessionPayload,
} from '@/definitions';
import { createCookieHelper, type CookieStore } from '../createCookieHelper';
import { createEncryptedJwt, decryptJwt } from '../jwt';
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

    return buildSessionPayload(data);
  };

  const setSession = async (
    payload: Readonly<SessionPayload>
  ): Promise<void> => {
    const encryptedSession = await createEncryptedJwt({
      payload,
      secretHex: getSecretHex(),
      expiresIn: SESSION_AGE,
    });

    setCookie(SESSION_KEY, encryptedSession, {
      maxAge: SESSION_AGE,
    });
  };

  const updateAccessToken = async (
    accessToken: string,
    payload: SessionPayload
  ): Promise<void> => {
    // TODO: It is not right, because the new session will set the session
    // expire time again
    await setSession({
      ...payload,
      accessToken,
    });
  };

  const updateHandle = async (handle: string): Promise<void> => {
    const payload = await getSession();
    if (!payload) {
      throw new Error('Unknown error');
    }

    const {
      user: { handle: _, ...user },
      ...rest
    } = payload;

    await setSession({
      ...rest,
      user: { ...user, handle },
    });
  };

  return {
    hasSession,
    destroySession,
    updateHandle,
    setSession,
    getSession,
    updateAccessToken,
  };
}

function buildSessionPayload(data: JsonRecord | null): SessionPayload | null {
  if (!data) {
    return null;
  }

  const { accessToken, refreshToken, user } = data;
  if (
    typeof accessToken !== 'string' ||
    typeof refreshToken !== 'string' ||
    !isPlainObject(user)
  ) {
    return null;
  }

  const { userId, handle, avatar } = user;

  if (
    typeof userId !== 'string' ||
    typeof handle !== 'string' ||
    (avatar !== undefined && typeof avatar !== 'string')
  ) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    user: { userId, handle, avatar },
  };
}
