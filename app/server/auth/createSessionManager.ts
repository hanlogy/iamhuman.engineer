import {
  SESSION_AGE,
  SESSION_KEY,
  USER_KEY,
  type SessionPayload,
  type UserSummary,
} from '@/definitions';
import { createCookieHelper, type CookieStore } from '../createCookieHelper';

export async function createSessionManager({
  cookieStore,
}: {
  cookieStore?: CookieStore;
} = {}) {
  const { getCookie, setCookie, deleteCookie } =
    await createCookieHelper(cookieStore);

  const getRawSession = () => {
    return getCookie(SESSION_KEY);
  };

  const hasSession = (): boolean => {
    return !!getRawSession();
  };

  const destroySession = () => {
    deleteCookie(SESSION_KEY);
    deleteCookie(USER_KEY);
  };

  const getSession = (): SessionPayload | null => {
    const raw = getRawSession();

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as SessionPayload;
    } catch {
      return null;
    }
  };

  const setSession = (
    payload: Readonly<Omit<SessionPayload, 'expiresAt'>>,
    /**
     * **CAUTION**: It is in seconds, not ms.
     */
    expiresIn: number = SESSION_AGE
  ): void => {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
    setCookie(SESSION_KEY, JSON.stringify({ ...payload, expiresAt }), {
      maxAge: expiresIn,
    });
  };

  const updateSession = (
    updater: (current: SessionPayload) => Omit<SessionPayload, 'expiresAt'>
  ): void => {
    const session = getSession();
    if (!session) {
      throw new Error('You have not logged in');
    }

    const expiresIn = Math.floor(session.expiresAt - Date.now() / 1000);
    if (expiresIn <= 0) {
      throw new Error('Session has expired');
    }

    setSession(updater(session), expiresIn);
  };

  const updateUser = ({
    avatar,
    handle,
  }: Partial<Pick<UserSummary, 'avatar' | 'handle'>>): void => {
    updateSession(({ user, ...rest }) => ({
      ...rest,
      user: {
        ...user,
        ...(avatar !== undefined ? { avatar } : {}),
        ...(handle ? { handle } : {}),
      },
    }));
  };

  return {
    hasSession,
    destroySession,
    updateSession,
    updateUser,
    setSession,
    getSession,
  };
}
