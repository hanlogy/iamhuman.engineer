import { sessionKey } from '@/definitions';
import { createCookieManager } from './createCookieManager';
import { decryptJwt, createEncryptedJwt } from './jwt';

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

  const payload = {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + (expiresIn - 300) * 1000,
  };

  const sessionAge = 30 * 24 * 60 * 60; // 30 days

  const encryptedSession = await createEncryptedJwt({
    payload,
    secretHex: getSecretHex(),
    expiresInSeconds: sessionAge,
  });

  const { setCookie } = await createCookieManager();

  await setCookie({
    name: sessionKey,
    value: encryptedSession,
    expiresInSeconds: sessionAge,
  });
}

export async function getSession() {
  const { getCookie } = await createCookieManager();
  const session = getCookie(sessionKey);

  if (!session) {
    return null;
  }
  const data = await decryptJwt({
    token: session,
    secretHex: getSecretHex(),
  });

  console.log(data);
}

function getSecretHex() {
  const secretHex = process.env.SESSION_ENCRYPTION_KEY;
  if (!secretHex) {
    throw new Error('SESSION_ENCRYPTION_KEY is missing');
  }
  return secretHex;
}
