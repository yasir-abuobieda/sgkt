import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الفعاليات',
  description: 'تصفح الفعاليات الثقافية والاجتماعية القادمة لمجلس الشباب السوداني - تركيا. سجل الآن وكن جزءاً من مجتمعنا.',
  openGraph: {
    title: 'الفعاليات | مجلس الشباب السوداني - تركيا',
    description: 'تصفح الفعاليات الثقافية والاجتماعية القادمة لمجلس الشباب السوداني - تركيا. سجل الآن وكن جزءاً من مجتمعنا.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الفعاليات | مجلس الشباب السوداني - تركيا',
    description: 'تصفح الفعاليات القادمة لمجلس الشباب السوداني - تركيا.',
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
