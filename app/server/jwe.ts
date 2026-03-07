import { isJsonValue, type JsonRecord, type JsonValue } from '@hanlogy/ts-lib';
import { EncryptJWT, jwtDecrypt, type JWTPayload } from 'jose';

interface GenerateEncryptedJwtParams {
  payload: JsonRecord;
  secretBase64: string;
  expiresInSeconds?: number;
  issuer?: string;
  audience?: string;
}

interface DecryptJwtParams {
  token: string;
  secretBase64: string;
  issuer: string;
  audience: string;
}

function getEncryptionKey(secretBase64: string): Uint8Array {
  if (!secretBase64) {
    throw new Error('JWE secret is required');
  }

  const key = new Uint8Array(Buffer.from(secretBase64, 'base64'));

  if (key.byteLength !== 32) {
    throw new Error('JWE secret must decode to exactly 32 bytes');
  }

  return key;
}

function assertPayload(payload: JsonRecord): void {
  if (!isJsonValue(payload) || Array.isArray(payload)) {
    throw new Error('JWE payload must be a JSON object');
  }
}

function toSessionPayload(payload: JWTPayload): JsonRecord | null {
  const sessionPayload: Record<string, JsonValue> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (
      key === 'iss' ||
      key === 'sub' ||
      key === 'aud' ||
      key === 'exp' ||
      key === 'nbf' ||
      key === 'iat' ||
      key === 'jti'
    ) {
      continue;
    }

    if (!isJsonValue(value)) {
      return null;
    }

    sessionPayload[key] = value;
  }

  return sessionPayload;
}

export async function generateEncryptedJwt(
  params: GenerateEncryptedJwtParams
): Promise<string> {
  const {
    payload,
    secretBase64,
    expiresInSeconds = 60 * 60 * 24 * 30,
    issuer = 'IAmHuman.Engineer-web',
    audience = 'IAmHuman.Engineer-session',
  } = params;

  assertPayload(payload);

  const key = getEncryptionKey(secretBase64);

  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .encrypt(key);
}

export async function decryptJwt(
  params: DecryptJwtParams
): Promise<JsonRecord | null> {
  const { token, secretBase64, issuer, audience } = params;

  try {
    const { payload } = await jwtDecrypt(
      token,
      getEncryptionKey(secretBase64),
      {
        issuer,
        audience,
      }
    );

    return toSessionPayload(payload);
  } catch {
    return null;
  }
}
