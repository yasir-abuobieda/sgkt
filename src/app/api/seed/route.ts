import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Generate 10 news
    const newsData = Array.from({ length: 10 }).map((_, i) => {
      const uniqueSuffix = Math.random().toString(36).substring(2, 8);
      return {
        title: `خبر تجريبي رقم ${i + 1}`,
        slug: `test-news-${i + 1}-${uniqueSuffix}`,
        category: 'أخبار المجلس',
        date: new Date().toISOString().split('T')[0],
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
        excerpt: 'هذا مقتطف تجريبي للخبر لإظهار شكل التصميم عند امتلاء الصفحة بالبيانات.',
        content: 'هذا محتوى تجريبي كامل للخبر. يمكن حذفه لاحقاً من لوحة التحكم بكل سهولة.'
      };
    });

    // Generate 10 events
    const eventsData = Array.from({ length: 10 }).map((_, i) => {
      return {
        title: `فعالية تجريبية رقم ${i + 1}`,
        location: 'إسطنبول',
        date: `${new Date().toISOString().split('T')[0]} | 14:00`,
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
        description: 'هذا وصف تجريبي للفعالية.'
      };
    });

    const { error: newsError } = await supabase.from('news').insert(newsData);
    if (newsError) throw newsError;

    const { error: eventsError } = await supabase.from('events').insert(eventsData);
    if (eventsError) throw eventsError;

    return NextResponse.json({ message: 'Seeded successfully! 10 news and 10 events added.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
