import { SESSION_KEY } from '@/definitions';
import { createCookieManager } from '../createCookieManager';
import { createEncryptedJwt } from '../jwt';
import { sessionAgeInSeconds, type SessionPayload } from './definitions';
import { getSecretHex } from './getSecretHex';

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
