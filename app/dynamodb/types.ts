import type { Profile } from '@/definitions/types';

export interface ProfileEntity extends Profile {
  readonly pk: string;
  readonly sk: string;
  readonly userId: string;
}

export class DBHelperError<T> extends Error {
  constructor({
    code,
    message,
    data,
  }: {
    code: string;
    message?: string;
    data?: T;
  }) {
    super(message);
    this.code = code;
    this.data = data;
  }

  readonly code: string;
  readonly data?: T;
  readonly name = 'DBHelperError';
}
