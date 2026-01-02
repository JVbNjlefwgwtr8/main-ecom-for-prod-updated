import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if user is authenticated
  const hasAuthToken = request.cookies.has('auth_token') || 
                       request.headers.get('Authorization');

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Protected routes that require authentication
  const isAdminRoute = pathname.includes('/admin-profile');
  const isStorefrontRoute = pathname.includes('/[slug]') && !pathname.includes('/auth');

  // If trying to access admin routes without auth, redirect to login
  if (isAdminRoute && !hasAuthToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
