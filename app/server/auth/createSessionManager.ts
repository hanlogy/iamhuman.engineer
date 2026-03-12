import { isPlainObject, shiftDate } from '@hanlogy/ts-lib';
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

  return {
    hasSession(): boolean {
      return !!getRawSession();
    },

    destroySession() {
      deleteCookie(SESSION_KEY);
      deleteCookie(USER_ID_KEY);
      deleteCookie(HANDLE_KEY);
    },

    async setSession({
      expiresIn,
      ...payload
    }: Readonly<
      Omit<SessionPayload, 'expiresAt'> & {
        readonly expiresIn: number;
      }
    >): Promise<void> {
      const encryptedSession = await createEncryptedJwt({
        payload: {
          ...payload,
          expiresAt: shiftDate({ seconds: expiresIn }).getTime(),
        },
        secretHex: getSecretHex(),
        expiresInSeconds: sessionAgeInSeconds,
      });

      setCookie(SESSION_KEY, encryptedSession, {
        maxAge: 60 * 60 * 24 * 30,
      });
    },

    async getSession(): Promise<SessionPayload | null> {
      const session = getRawSession();

      if (!session) {
        return null;
      }

      const data = await decryptJwt({
        token: session,
        secretHex: getSecretHex(),
      });

      if (!isSessionPayload(data)) {
        return null;
      }

      return data;
    },
  };
}
function isSessionPayload(data: unknown): data is SessionPayload {
  if (!isPlainObject(data)) {
    return false;
  }

  return (
    typeof data.accessToken === 'string' &&
    typeof data.refreshToken === 'string' &&
    typeof data.expiresAt === 'number'
  );
}
