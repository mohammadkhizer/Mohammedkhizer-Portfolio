import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  // 1. Lockdown LLMS files: Always return 404 for llms.txt and related files
  if (
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname === '/ai.txt' ||
    pathname.endsWith('/llms.txt')
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // 2. SEO Files Soft Gate:
  // Gate robots.txt and sitemap.xml to known search crawlers only (Googlebot, Bingbot, DuckDuckBot, YandexBot, Applebot).
  // Return 404 for normal browsers and unauthorized scrapers.
  // Note: This is an intentional User-Agent soft gate for SEO control and crawling budget protection,
  // NOT a cryptographic security boundary (since User-Agent can be spoofed by custom HTTP clients).
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    const isAllowedCrawler = /(Googlebot|Bingbot|DuckDuckBot|YandexBot|Applebot)/i.test(userAgent);
    if (!isAllowedCrawler) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // 3. Admin & Admin API Route Protection
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminApiRoute = pathname.startsWith('/api/admin');
  const isAuthWhitelist =
    pathname === '/admin/login' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/admin/auth');

  // Check for Auth.js / NextAuth session cookies
  const authSessionCookie =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    request.cookies.get('admin_session')?.value;

  if (isAdminRoute && !isAuthWhitelist) {
    if (!authSessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminApiRoute && !isAuthWhitelist) {
    if (!authSessionCookie) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }
  }

  const response = NextResponse.next();

  // 4. Admin Security Headers: noindex, nofollow and no-store
  if (isAdminRoute || isAdminApiRoute) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // 5. Standard Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  const permissionsPolicy = [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()',
  ];
  response.headers.set('Permissions-Policy', permissionsPolicy.join(', '));
  response.headers.delete('x-powered-by');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - images, fonts
     */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
