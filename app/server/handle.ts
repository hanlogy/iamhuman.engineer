import { HANDLE_KEY } from '@/definitions';
import { createCookieManager } from './createCookieManager';

export async function setHandleCookie(handle: string): Promise<void> {
  const { setCookie } = await createCookieManager();

  await setCookie({
    name: HANDLE_KEY,
    value: handle,
    expiresInSeconds: 60 * 60 * 24 * 365 * 10,
  });
}
