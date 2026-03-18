import { decodeJwt } from 'jose';

export function getUserIdFromAccessToken(accessToken: string): string | null {
  const payload = decodeJwt(accessToken);

  return typeof payload.sub === 'string' ? payload.sub : null;
}
