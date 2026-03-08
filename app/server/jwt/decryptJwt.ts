import { isJsonValue, type JsonRecord, type JsonValue } from '@hanlogy/ts-lib';
import { jwtDecrypt } from 'jose';
import { prepareEncryptionKey } from './prepareEncryptionKey';
import type { DecryptJwtParams } from './types';

export async function decryptJwt({
  token,
  secretHex,
  issuer,
  audience,
}: DecryptJwtParams): Promise<JsonRecord | null> {
  try {
    const { payload: rawPayload } = await jwtDecrypt(
      token,
      prepareEncryptionKey(secretHex),
      {
        issuer,
        audience,
      }
    );

    const payload: Record<string, JsonValue> = {};
    for (const [key, value] of Object.entries(rawPayload)) {
      if (isRegisteredJwtClaim(key)) {
        continue;
      }

      if (!isJsonValue(value)) {
        return null;
      }

      payload[key] = value;
    }

    return payload;
  } catch {
    return null;
  }
}

function isRegisteredJwtClaim(key: string): boolean {
  return (
    key === 'iss' ||
    key === 'sub' ||
    key === 'aud' ||
    key === 'exp' ||
    key === 'nbf' ||
    key === 'iat' ||
    key === 'jti'
  );
}
