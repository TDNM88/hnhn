import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

// Define which routes require authentication
const adminRoutes = [
  '/admin',
  '/admin/users',
  '/admin/trades',
  '/admin/transactions',
];

const authRequiredRoutes = [
  '/account',
  '/bank',
  '/change-password',
  '/deposit',
  '/deposit-history',
  '/identify',
  '/withdraw',
  '/withdraw-history',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Check if the route requires authentication
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRequired = authRequiredRoutes.some(route => pathname.startsWith(route));
  
  // If it's an admin route or requires authentication
  if (isAdminRoute || isAuthRequired) {
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verify token
    const user = verifyToken(token);
    
    // If token is invalid, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // If it's an admin route and user is not admin, redirect to home
    if (isAdminRoute && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
