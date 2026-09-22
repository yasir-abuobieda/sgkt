import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../app/globals.css";
import { ClientLayout } from "@/components/client-layout";
import favicon from '@/favicon.png';

import { cookies } from 'next/headers';

const cairo = Cairo({ subsets: ["arabic", "latin"] });

const SITE_URL = 'https://sgkturkiye.org';
const SITE_NAME = 'مجلس الشباب السوداني - تركيا | Sudan Gençlik Konseyi - Türkiye';
const SITE_DESC = 'المنصة الرسمية لمجلس الشباب السوداني - تركيا (Sudan Gençlik Konseyi - Türkiye). هيئة شبابية وطنية مستقلة تمثل الإطار الجامع للشباب السوداني في تركيا، وتهدف إلى خلق مساحات شبابية وتطوير قدرات الشباب السوداني.';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | مجلس الشباب السوداني`,
  },
  description: SITE_DESC,
  keywords: ['مجلس الشباب السوداني', 'مجلس الشباب السوداني تركيا', 'Sudan gençlik', 'Sudan gençlik konseyi', 'مساحات شبابية', 'sgkturkiye', 'الشباب السوداني تركيا', 'Sudanese Youth Turkey', 'طلاب سودانيون في تركيا', 'SGK'],
  authors: [{ name: 'مجلس الشباب السوداني - تركيا' }],
  creator: 'مجلس الشباب السوداني - تركيا',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    url: SITE_URL,
    type: 'website',
    locale: 'ar_AR',
    siteName: 'مجلس الشباب السوداني - تركيا',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESC,
    images: [OG_IMAGE],
  },
  icons: {
    icon: favicon.src,
  },
  verification: {
    google: 'VL4KbGCbxZzHtzm_3S1E6EYT6P9hMXhSWJSOpi6yHz0',
  }
};

import { GoogleTranslate } from "@/components/google-translate";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const googtrans = cookieStore.get('googtrans')?.value;
  const isLtr = googtrans?.includes('/en') || googtrans?.includes('/tr');
  const dir = isLtr ? 'ltr' : 'rtl';
  const lang = googtrans?.includes('/en') ? 'en' : googtrans?.includes('/tr') ? 'tr' : 'ar';

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body className={`${cairo.className} bg-slate-50 text-slate-800`} suppressHydrationWarning>
        <GoogleTranslate />
        <ClientLayout initialLang={lang}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
