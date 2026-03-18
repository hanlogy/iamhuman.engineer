import { USER_KEY, type UserSummary } from '@/definitions';
import { createCookieHelper } from './createCookieHelper';

export async function getUserFromCookie(): Promise<UserSummary | undefined> {
  const { getCookie } = await createCookieHelper();
  const userRaw = getCookie(USER_KEY);
  if (!userRaw) {
    return undefined;
  }
  const { userId, handle, avatar } = JSON.parse(userRaw);

  return { userId, handle, avatar };
}
