import { NextResponse, NextRequest } from 'next/server';

// Simple in-memory rate limiter for login attempts
// Resets when server restarts (sufficient for Edge runtime protection)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_ATTEMPTS) return true;

  entry.count++;
  return false;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Rate-limit the login page
  if (path === '/admin/login' && request.method === 'POST') {
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many login attempts. Try again in 15 minutes.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Check authentication for all /admin routes except login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    const isAdmin = token === 'secure_sgk_token_2026';

    if (!isAdmin) {
      // Rewrite to login page while keeping URL unchanged
      return NextResponse.rewrite(new URL('/admin/login', request.url));
    }
  }

  // If already logged in and visiting /admin/login, redirect to dashboard
  if (path === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token === 'secure_sgk_token_2026') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  const response = NextResponse.next();

  // Remove server fingerprinting headers
  response.headers.delete('X-Powered-By');

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
