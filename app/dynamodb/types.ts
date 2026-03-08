import type { Profile } from '@/definitions/types';

export interface ProfileEntity extends Profile {
  readonly pk: string;
  readonly sk: string;
  readonly userId: string;
}
