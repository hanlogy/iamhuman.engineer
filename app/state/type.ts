export type AppContextValue = {
  host: string;
  pathname: string;
} & (
  | {
      isLoggedIn: true;
      userId: string;
      handle: string;
    }
  | {
      isLoggedIn: false;
      userId: undefined;
      handle: undefined;
    }
);
