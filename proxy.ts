import { NextRequest, NextResponse } from 'next/server';
import { handleSession } from '@/proxy/handleSession';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { handle } = (await handleSession(request, response)) ?? {};
  const pathname = request.nextUrl.pathname;

  if (pathname === '/') {
    if (handle) {
      return NextResponse.redirect(new URL(`/${handle}`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};
