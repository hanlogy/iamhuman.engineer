import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type GetCookie = NextRequest['cookies']['get'];
type SetCookie = NextResponse['cookies']['set'];
type DeleteCookie = NextResponse['cookies']['delete'];

// interface SetCookieOptions {
//   readonly httpOnly?: boolean | undefined;
//   readonly secure?: boolean | undefined;
//   readonly sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined;
//   readonly path?: string | undefined;
//   readonly maxAge?: number | undefined;
// }

export interface CookieStore {
  get: GetCookie;
  set: SetCookie;
  delete: DeleteCookie;
}

export async function createCookieHelper(store?: CookieStore | undefined) {
  const cookieStore = store ?? (await cookies());

  return {
    cookieStore,
    setCookie: (
      name: string,
      value: string,
      {
        maxAge,
      }: {
        maxAge?: number | undefined;
      } = {}
    ) => {
      cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge,
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

export function createCookieStoreFromServer(
  request: NextRequest,
  response: NextResponse
): CookieStore {
  return {
    get: request.cookies.get.bind(request.cookies),
    set: response.cookies.set.bind(response.cookies),
    delete: response.cookies.delete.bind(response.cookies),
  };
}
