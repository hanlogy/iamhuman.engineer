import { USER_TO_CONFIRM_KEY } from '@/definitions';
import { createCookieHelper } from '@/server/createCookieHelper';

export interface UserToConfirm {
  email: string;
  password: string;
  from: 'signup' | 'login';
}

export async function setUserToConfirm(data: UserToConfirm) {
  const { setCookie } = await createCookieHelper();

  setCookie(USER_TO_CONFIRM_KEY, JSON.stringify(data), {
    maxAge: 60 * 60 * 24,
  });
}

export async function getUserToConfirm(): Promise<UserToConfirm | undefined> {
  const { getCookie } = await createCookieHelper();
  const cachedUser = getCookie(USER_TO_CONFIRM_KEY);

  if (!cachedUser) {
    return undefined;
  }

  let user: UserToConfirm;
  try {
    user = JSON.parse(cachedUser);

    if (!user.email || !user.password || !user.from) {
      return undefined;
    }

    return user;
  } catch {
    return undefined;
  }
}

export async function deleteUserToConfirm() {
  const { deleteCookie } = await createCookieHelper();

  deleteCookie(USER_TO_CONFIRM_KEY);
}
