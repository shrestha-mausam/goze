import authService from '@/services/authentication.server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const validateToken = async (accessToken: string) => {
  const response = await authService.validateToken(accessToken);
  return response.ok;
}

// Public API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/refresh'
];

// Public page routes that don't require authentication
const PUBLIC_PAGE_ROUTES = [
  '/error',
  '/maintenance',
  // Note: '/', and /login is removed from public routes as we'll handle it specially
];

export async function middleware(request: NextRequest) {
  // Handle HTTPS redirect in production
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(new URL("/", `https://${request.headers.get('host')}/${request.nextUrl.pathname}`));
  }

  const path = request.nextUrl.pathname;
  
  // 1. Check if this is a public route (both API and pages)
  const isPublicApiRoute = PUBLIC_API_ROUTES.some(route => path.startsWith(route));
  const isPublicPageRoute = PUBLIC_PAGE_ROUTES.some(route => path === route);
  
  if (isPublicApiRoute || isPublicPageRoute) {
    // Allow access to public routes without authentication
    return NextResponse.next();
  }
  
  // 2. For protected routes, check authentication
  const accessToken = request.cookies.get('accessToken')?.value;
  let isValidToken = false;

  // Validate token if it exists
  if (accessToken) {
    try {
      isValidToken = await validateToken(accessToken);
    } catch {
      isValidToken = false;
    }
  }

  // Handle authentication based routing
  if (isValidToken) {
    // Redirect authenticated users from login/root to home
    return (path === '/login' || path === '/') 
      ? NextResponse.redirect(new URL('/home', request.url))
      : NextResponse.next();
  } else {
    // Allow access to login page, redirect others to login
    return path === '/login'
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. Static files (/favicon.ico, /_next/static, /_next/image)
     * 2. Public assets (/public/*)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 

