import { NextRequest, NextResponse } from 'next/server';
import { HANDLE_KEY } from '@/definitions';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === '/') {
    const handle = request.cookies.get(HANDLE_KEY)?.value;
    if (handle) {
      return NextResponse.redirect(new URL(`/${handle}`, request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};
