import { EncryptJWT } from 'jose';
import { prepareEncryptionKey } from './prepareEncryptionKey';
import type { CreateEncryptedJwtParams } from './types';

export async function createEncryptedJwt({
  payload,
  secretHex,
  expiresInSeconds = 60 * 60 * 24 * 30,
  issuer,
  audience,
}: CreateEncryptedJwtParams): Promise<string> {
  const jwt = new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds);

  if (issuer) {
    jwt.setIssuer(issuer);
  }

  if (audience) {
    jwt.setAudience(audience);
  }

  return jwt.encrypt(prepareEncryptionKey(secretHex));
}
