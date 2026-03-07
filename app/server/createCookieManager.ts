import { cookies } from 'next/headers';

export async function createCookieManager() {
  const cookieStore = await cookies();

  return {
    setCookie: async ({
      name,
      value,
      // 30 days
      expiresInSeconds = 60 * 60 * 24 * 30,
    }: {
      name: string;
      value: string;
      expiresInSeconds?: number;
    }) => {
      cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: expiresInSeconds,
      });
    },

    getCookie(name: string): string | undefined {
      return cookieStore.get(name)?.value;
    },

    deleteCookie(name: string): void {
      cookieStore.delete(name);
    },
  };
}
