import { USER_TO_CONFIRM_KEY } from '@/definitions';
import { createCookieManager } from '@/server/createCookieManager';

export interface UserToConfirm {
  email: string;
  password: string;
  from: 'signup' | 'login';
}

export async function setUserToConfirm(data: UserToConfirm) {
  const { setCookie } = await createCookieManager();

  await setCookie({
    name: USER_TO_CONFIRM_KEY,
    value: JSON.stringify(data),
    expiresInSeconds: 60 * 60 * 24,
  });
}

export async function getUserToConfirm(): Promise<UserToConfirm | undefined> {
  const { getCookie } = await createCookieManager();
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
  const { deleteCookie } = await createCookieManager();

  deleteCookie(USER_TO_CONFIRM_KEY);
}
