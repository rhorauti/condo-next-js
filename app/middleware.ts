import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup', '/auth/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // pega cookie criado pelo NestJS
  const accessToken = request.cookies.get('access_token')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  /**
   * ❌ NÃO TEM TOKEN → manda pro login
   */
  if (!accessToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  /**
   * ✅ JÁ LOGADO tentando acessar login
   */
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/web', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      protege tudo exceto assets
    */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
