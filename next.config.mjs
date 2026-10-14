import fs from 'fs';
import path from 'path';

// Ensure about image (about.jpeg / about.jpg) is synced and about.mp4 is cleaned up
try {
  const homeDir = path.join(process.cwd(), 'src', 'home');
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Delete about.mp4 to free space and keep repository light
  const mp4InHome = path.join(homeDir, 'about.mp4');
  if (fs.existsSync(mp4InHome)) {
    try { fs.unlinkSync(mp4InHome); } catch {}
  }
  const mp4InPublic = path.join(publicDir, 'about.mp4');
  if (fs.existsSync(mp4InPublic)) {
    try { fs.unlinkSync(mp4InPublic); } catch {}
  }

  // Sync about.jpeg and about.jpg
  const srcJpeg = path.join(homeDir, 'about.jpeg');
  const srcJpg = path.join(homeDir, 'about.jpg');
  const imageSource = fs.existsSync(srcJpeg) ? srcJpeg : fs.existsSync(srcJpg) ? srcJpg : null;

  if (imageSource) {
    if (!fs.existsSync(srcJpg)) {
      try { fs.copyFileSync(imageSource, srcJpg); } catch {}
    }
    if (!fs.existsSync(srcJpeg)) {
      try { fs.copyFileSync(imageSource, srcJpeg); } catch {}
    }
    try { fs.copyFileSync(imageSource, path.join(publicDir, 'about.jpg')); } catch {}
    try { fs.copyFileSync(imageSource, path.join(publicDir, 'about.jpeg')); } catch {}
  }
} catch (e) {
  console.error('Failed to sync about image:', e);
}

const securityHeaders = [
  // Prevent clickjacking (no iframes allowed from other origins)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Stop browsers from MIME-sniffing a response away from the declared content-type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Enable XSS protection in older browsers
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Don't send referrer to external sites
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Force HTTPS for 2 years (enable when on production HTTPS)
  // { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Disable browser features we don't use
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + Google Translate + inline (needed by Next.js)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.gstatic.com",
      // Styles: self + inline (needed by Next.js/Tailwind) + Google Fonts + Translate
      "style-src 'self' 'unsafe-inline' https://*.google.com https://*.googleapis.com https://*.gstatic.com",
      // Fonts
      "font-src 'self' https://*.gstatic.com https://fonts.gstatic.com data:",
      // Images: self + supabase + api.sgkturkiye.org + unsplash + Google Translate + gstatic
      "img-src 'self' data: blob: https://*.supabase.co https://api.sgkturkiye.org https://images.unsplash.com https://*.gstatic.com https://*.google.com https://*.googleapis.com",
      // Media: videos / audio
      "media-src 'self' blob: data:",
      // Connections: self + supabase + api.sgkturkiye.org + Google Translate API + dev websockets
      "connect-src 'self' https://*.supabase.co https://api.sgkturkiye.org https://*.google.com https://*.googleapis.com https://*.gstatic.com ws: wss:",
      // Frames (Google Translate uses iframes)
      "frame-src 'self' https://*.google.com https://*.googleapis.com",
      // No plugins
      "object-src 'none'",
      // Base URI
      "base-uri 'self'",
      // Form submissions only to self
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Block access to debug/seed API routes in production
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        { source: '/api/seed', destination: '/404', permanent: false },
        { source: '/api/seed-office', destination: '/404', permanent: false },
        { source: '/api/test-db', destination: '/404', permanent: false },
      ];
    }
    return [];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    // Limit image sizes to avoid abuse
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Don't expose powered-by header
  poweredByHeader: false,
};

export default nextConfig;
