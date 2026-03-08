import type { JsonRecord } from '@hanlogy/ts-lib';

interface JweParams {
  secretHex: string;
  issuer?: string;
  audience?: string | string[];
}

export interface CreateEncryptedJwtParams extends JweParams {
  payload: JsonRecord;
  expiresInSeconds?: number;
}

export interface DecryptJwtParams extends JweParams {
  token: string;
}
