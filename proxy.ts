import { NextRequest, NextResponse } from 'next/server';
import { createSessionManager } from '@/server/auth/createSessionManager';
import {
  createCookieHelper,
  createCookieStoreFromServer,
} from '@/server/createCookieHelper';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { cookieStore } = await createCookieHelper(
    createCookieStoreFromServer(request, response)
  );

  const { getSession } = await createSessionManager({ cookieStore });
  const user = await getSession();

  const pathname = request.nextUrl.pathname;

  if (pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL(`/${user.handle}`, request.url));
    }
  } else if (pathname.startsWith('/settings') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico|_next/image|.*\\.png$).*)'],
};
