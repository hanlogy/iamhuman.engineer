import { isPlainObject } from '@hanlogy/ts-lib';
import { SESSION_KEY } from '@/definitions';
import { createCookieManager } from '../createCookieManager';
import { createEncryptedJwt, decryptJwt } from '../jwt';
import { sessionAgeInSeconds, type SessionPayload } from './definitions';
import { getSecretHex } from './getSecretHex';

export async function hasSession(): Promise<boolean> {
  const { getCookie } = await createCookieManager();
  return getCookie(SESSION_KEY) !== null;
}

export async function setSession(
  payload: Readonly<SessionPayload>
): Promise<void> {
  const encryptedSession = await createEncryptedJwt({
    payload,
    secretHex: getSecretHex(),
    expiresInSeconds: sessionAgeInSeconds,
  });

  const { setCookie } = await createCookieManager();

  await setCookie({
    name: SESSION_KEY,
    value: encryptedSession,
    expiresInSeconds: sessionAgeInSeconds,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const { getCookie } = await createCookieManager();
  const session = getCookie(SESSION_KEY);

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
