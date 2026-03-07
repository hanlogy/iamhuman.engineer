import { sessionKey } from '@/definitions';
import { createCookieManager } from './createCookieManager';
import { generateEncryptedJwt } from './jwe';

export async function setSession({
  accessToken,
  refreshToken,
  expiresIn,
}: {
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
  expiresIn?: number | undefined;
}) {
  if (!accessToken) {
    throw new Error('accessToken is missing');
  }

  if (!refreshToken) {
    throw new Error('refreshToken is missing');
  }

  if (!expiresIn) {
    throw new Error('expiresIn is missing');
  }

  const secretHex = process.env.SESSION_ENCRYPTION_KEY;
  if (!secretHex) {
    throw new Error('SESSION_ENCRYPTION_KEY is missing');
  }

  const payload = {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + (expiresIn - 300) * 1000,
  };

  const sessionAge = 30 * 24 * 60 * 60; // 30 days

  const encryptedSession = await generateEncryptedJwt({
    payload,
    secretHex,
    expiresInSeconds: sessionAge,
  });

  const { setCookie } = await createCookieManager();

  await setCookie({
    name: sessionKey,
    value: encryptedSession,
    expiresInSeconds: sessionAge,
  });
}
