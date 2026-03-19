import { EncryptJWT } from 'jose';
import { prepareEncryptionKey } from './prepareEncryptionKey';
import type { CreateEncryptedJwtParams } from './types';

export async function createEncryptedJwt({
  payload,
  secretHex,
  expiresIn,
  issuer,
  audience,
}: CreateEncryptedJwtParams): Promise<string> {
  const jwt = new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt();

  if (expiresIn !== undefined) {
    jwt.setExpirationTime(`${expiresIn}s`);
  }

  if (issuer) {
    jwt.setIssuer(issuer);
  }

  if (audience) {
    jwt.setAudience(audience);
  }

  return jwt.encrypt(prepareEncryptionKey(secretHex));
}
