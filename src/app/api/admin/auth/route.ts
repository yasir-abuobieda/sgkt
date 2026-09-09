import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiter (resets on server restart)
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX = 5;
const WINDOW = 15 * 60 * 1000; // 15 minutes

// Password is read from env variable for security; fallback to hardcoded for dev
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin.sgk/tr';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();

  // Rate limiting
  const entry = attempts.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= MAX) {
      return NextResponse.json(
        { error: 'Too many attempts' },
        { status: 429 }
      );
    }
    entry.count++;
  } else {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW });
  }

  // Parse body
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Clear attempts on successful login
  attempts.delete(ip);

  // Set HttpOnly + Secure + SameSite=Strict cookie (cannot be read by JS)
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', 'secure_sgk_token_2026', {
    httpOnly: true,        // Not accessible via JS (prevents XSS token theft)
    secure: process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') === 'https', // HTTPS only in production if using domain
    sameSite: 'strict',    // Prevents CSRF
    maxAge: 60 * 60 * 24,  // 24 hours
    path: '/',
  });

  return response;
}
