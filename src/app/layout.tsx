import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../app/globals.css";
import { ClientLayout } from "@/components/client-layout";

import { cookies } from 'next/headers';

const cairo = Cairo({ subsets: ["arabic", "latin"] });

const SITE_URL = 'https://sgk.com.tr';
const SITE_NAME = 'مجلس الشباب السوداني بتركيا | Sudan Gençlik Konseyi';
const SITE_DESC = 'المنصة الرسمية لمجلس الشباب السوداني بتركيا - Sudan Gençlik Konseyi (SGK). هيئة شبابية وطنية مستقلة تمثل الإطار الجامع للشباب السوداني في تركيا.';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | مجلس الشباب السوداني`,
  },
  description: SITE_DESC,
  keywords: ['مجلس الشباب السوداني', 'Sudan Gençlik Konseyi', 'SGK', 'الشباب السوداني تركيا', 'Sudanese Youth Turkey', 'طلاب سودانيون في تركيا'],
  authors: [{ name: 'مجلس الشباب السوداني' }],
  creator: 'مجلس الشباب السوداني',
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
    siteName: 'مجلس الشباب السوداني',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESC,
    images: [OG_IMAGE],
  },
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
