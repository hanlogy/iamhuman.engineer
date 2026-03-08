import { isPlainObject } from '@hanlogy/ts-lib';
import { sessionKey } from '@/definitions';
import { createCookieManager } from '../createCookieManager';
import { decryptJwt } from '../jwt';
import type { SessionPayload } from './definitions';
import { getSecretHex } from './getSecretHex';

export async function getSession(): Promise<SessionPayload | null> {
  const { getCookie } = await createCookieManager();
  const session = getCookie(sessionKey);

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
