import { NextRequest, NextResponse } from 'next/server';
import { handleSession } from '@/proxy/handleSession';
import {
  createCookieHelper,
  createCookieStoreFromServer,
} from '@/server/createCookieHelper';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { setCookie, cookieStore } = await createCookieHelper(
    createCookieStoreFromServer(request, response)
  );

  const { handle } = (await handleSession({ setCookie, cookieStore })) ?? {};

  const pathname = request.nextUrl.pathname;

  if (pathname === '/') {
    if (handle) {
      return NextResponse.redirect(new URL(`/${handle}`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico|_next/image|.*\\.png$).*)'],
};
