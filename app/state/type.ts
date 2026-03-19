import type { UserSummary } from '@/definitions';

export type AppContextValue = {
  host: string;
  pathname: string;
} & (
  | {
      isLoggedIn: true;
      user: UserSummary;
    }
  | {
      isLoggedIn: false;
      user: undefined;
    }
);
