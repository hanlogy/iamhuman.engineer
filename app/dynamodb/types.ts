import type { Profile } from '@/definitions/types';

export type CreateProfileFields = Pick<Profile, 'handle'> & {
  userId: string;
};

export interface ProfileEntity extends Profile {
  readonly pk: string;
  readonly sk: string;
  readonly userId: string;
}
