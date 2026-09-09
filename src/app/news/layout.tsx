import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أخبار المجلس',
  description: 'آخر أخبار وبيانات مجلس الشباب السوداني بتركيا. تابع كل ما يخص مجتمعنا من فعاليات وإعلانات ومستجدات.',
  openGraph: {
    title: 'أخبار المجلس | مجلس الشباب السوداني',
    description: 'آخر أخبار وبيانات مجلس الشباب السوداني بتركيا. تابع كل ما يخص مجتمعنا من فعاليات وإعلانات ومستجدات.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أخبار المجلس | مجلس الشباب السوداني',
    description: 'آخر أخبار وبيانات مجلس الشباب السوداني بتركيا.',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
