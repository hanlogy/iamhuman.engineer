import { sessionKey } from '@/definitions';
import { createCookieManager } from '../createCookieManager';
import { createEncryptedJwt } from '../jwt';
import {
  sessionAgeInSeconds,
  type SessionPayload,
  type SetSessionParams,
} from './definitions';
import { getSecretHex } from './getSecretHex';

export async function setSession({
  accessToken,
  refreshToken,
  expiresIn,
  handle,
}: SetSessionParams): Promise<void> {
  if (expiresIn <= 0) {
    throw new Error('expiresIn must be greater than 0 seconds');
  }

  const payload: Readonly<SessionPayload> = {
    accessToken,
    refreshToken,
    handle,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  const encryptedSession = await createEncryptedJwt({
    payload,
    secretHex: getSecretHex(),
    expiresInSeconds: sessionAgeInSeconds,
  });

  const { setCookie } = await createCookieManager();

  await setCookie({
    name: sessionKey,
    value: encryptedSession,
    expiresInSeconds: sessionAgeInSeconds,
  });
}
