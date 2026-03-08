import { sessionKey } from '@/definitions';
import { createCookieManager } from '../createCookieManager';
import { createEncryptedJwt } from '../jwt';
import {
  accessTokenExpiryBufferInSeconds,
  sessionAgeInSeconds,
  type SessionPayload,
  type SetSessionParams,
} from './definitions';
import { getSecretHex } from './getSecretHex';

export async function setSession({
  accessToken,
  refreshToken,
  expiresIn,
}: SetSessionParams): Promise<void> {
  if (accessToken === undefined) {
    throw new Error('accessToken is missing');
  }

  if (refreshToken === undefined) {
    throw new Error('refreshToken is missing');
  }

  if (expiresIn === undefined) {
    throw new Error('expiresIn is missing');
  }

  if (expiresIn <= accessTokenExpiryBufferInSeconds) {
    throw new Error('expiresIn must be greater than 300 seconds');
  }

  const payload: Readonly<SessionPayload> = {
    accessToken,
    refreshToken,
    expiresAt:
      Date.now() + (expiresIn - accessTokenExpiryBufferInSeconds) * 1000,
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
