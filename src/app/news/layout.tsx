import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أخبار المجلس',
  description: 'آخر أخبار وبيانات مجلس الشباب السوداني - تركيا. تابع كل ما يخص مجتمعنا من فعاليات وإعلانات ومستجدات.',
  openGraph: {
    title: 'أخبار المجلس | مجلس الشباب السوداني - تركيا',
    description: 'آخر أخبار وبيانات مجلس الشباب السوداني - تركيا. تابع كل ما يخص مجتمعنا من فعاليات وإعلانات ومستجدات.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أخبار المجلس | مجلس الشباب السوداني - تركيا',
    description: 'آخر أخبار وبيانات مجلس الشباب السوداني - تركيا.',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
