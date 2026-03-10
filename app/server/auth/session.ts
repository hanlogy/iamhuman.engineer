import { isPlainObject, shiftDate } from '@hanlogy/ts-lib';
import { HANDLE_KEY, SESSION_KEY, USER_ID_KEY } from '@/definitions';
import { createCookieManager } from '../createCookieManager';
import { createEncryptedJwt, decryptJwt } from '../jwt';
import { sessionAgeInSeconds, type SessionPayload } from './definitions';
import { getSecretHex } from './getSecretHex';

/**
 * **Warning**: Do not use it in proxy
 */
export async function hasSession(): Promise<boolean> {
  const { getCookie } = await createCookieManager();
  return getCookie(SESSION_KEY) !== null;
}

export async function destroySession(deleteFn: (name: string) => void) {
  deleteFn(SESSION_KEY);
  deleteFn(USER_ID_KEY);
  deleteFn(HANDLE_KEY);
}

export async function setSession(
  {
    expiresIn,
    ...payload
  }: Readonly<
    Omit<SessionPayload, 'expiresAt'> & {
      readonly expiresIn: number;
    }
  >,
  setFn: (options: { name: string; value: string }) => void
): Promise<void> {
  const encryptedSession = await createEncryptedJwt({
    payload: {
      ...payload,
      expiresAt: shiftDate({ seconds: expiresIn }).getTime(),
    },
    secretHex: getSecretHex(),
    expiresInSeconds: sessionAgeInSeconds,
  });

  setFn({ name: SESSION_KEY, value: encryptedSession });
}

export async function getSession(
  getFn: (name: string) => string | undefined | null
): Promise<SessionPayload | null> {
  const session = getFn(SESSION_KEY);

  if (!session) {
    return null;
  }

  const data = await decryptJwt({ token: session, secretHex: getSecretHex() });

  if (!isSessionPayload(data)) {
    return null;
  }

  return data;
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
