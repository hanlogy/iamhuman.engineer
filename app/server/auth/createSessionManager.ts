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

  const getSession = async (): Promise<{
    payload: SessionPayload;
    expiresAt: number;
  } | null> => {
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

    const { payload: payloadLike, expiresAt } = data;
    const payload = buildSessionPayload(payloadLike);
    if (!payload || !expiresAt) {
      return null;
    }

    return { payload, expiresAt };
  };

  const setSession = async (
    payload: Readonly<SessionPayload>,
    /**
     * **CAUTION**: It is in seconds, not ms.
     */
    expiresAt?: number | undefined
  ): Promise<void> => {
    let expiresIn = SESSION_AGE;

    if (expiresAt !== undefined) {
      expiresIn = Math.floor(expiresAt - Date.now() / 1000);

      if (expiresIn <= 0) {
        throw new Error('expiresAt must be in the future');
      }
    }

    const encryptedSession = await createEncryptedJwt({
      payload,
      secretHex: getSecretHex(),
      expiresIn,
    });

    setCookie(SESSION_KEY, encryptedSession, {
      maxAge: expiresIn,
    });
  };

  const updateHandle = async (handle: string): Promise<void> => {
    const session = await getSession();
    if (!session) {
      throw new Error('You have not logged in');
    }

    const {
      payload: {
        user: { handle: _, ...userRest },
        ...payloadRest
      },
      expiresAt,
    } = session;

    await setSession(
      {
        ...payloadRest,
        user: { ...userRest, handle },
      },
      expiresAt
    );
  };

  return {
    hasSession,
    destroySession,
    updateHandle,
    setSession,
    getSession,
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
