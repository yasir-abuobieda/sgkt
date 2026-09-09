import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { JoinUsButton } from '@/components/registration-modal';
import { EventsCarousel, NewsCarousel } from '@/components/home-carousels';

// Revalidate this page instantly to always show fresh data
export const revalidate = 0;

export default async function Home() {
  // Fetch latest 5 news
  const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(5);
  const latestNews = newsData || [];

  // Fetch upcoming 5 events
  const { data: eventsData } = await supabase.from('events').select('*').eq('status', 'upcoming').order('created_at', { ascending: false }).limit(5);
  const upcomingEvents = eventsData || [];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-maroon/5 to-white py-24 px-4 border-b border-brand-maroon/10">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-brand-maroon mb-4 leading-relaxed">
            مجلس الشباب السوداني في تركيا
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-gold mb-8 tracking-wide">
            Türkiye Sudan Gençlik Konseyi | SGKT
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            المظلة الوطنية المستقلة لتمكين الكفاءات الشابة، وبناء جسور الشراكة، وصناعة الحضور الفاعل والمؤثر في تركيا.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/events" 
              className="inline-block bg-brand-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-gold/90 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              انضم إلينا
            </Link>
            <Link 
              href="/about" 
              className="inline-block bg-white text-brand-maroon border-2 border-brand-maroon px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-maroon/5 transition shadow-sm hover:-translate-y-1"
            >
              تعرف علينا
            </Link>
          </div>
        </div>
      </section>


      {/* Quick About Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-gold font-bold text-lg mb-2 block">من نحن؟</span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-maroon mb-6 leading-tight">مظلة وطنية جامعة.. لتمكين الكفاءات وصناعة الأثر</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                هيئة شبابية وطنية مستقلة، تمثل الإطار الجامع للشباب السوداني في الجمهورية التركية. نعمل على حشد الكفاءات وتوجيه الطاقات، وتوفير بيئة متكاملة للرعاية والتأهيل وبناء الشراكات النوعية، لتعزيز الحضور الإيجابي وتمكين جيل واعٍ يقود المستقبل ويخدم مجتمعه ووطنه.
              </p>
              <Link href="/about" className="inline-flex items-center text-brand-maroon font-bold text-lg hover:text-brand-gold transition-colors">
                اقرأ المزيد عن أهدافنا
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 rotate-180"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" alt="شباب" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-brand-maroon/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Events */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-brand-gold font-bold text-lg mb-2 block">أنشطتنا</span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-maroon">الفعاليات القادمة</h2>
            </div>
            <Link href="/events" className="hidden md:inline-flex items-center text-slate-500 font-bold hover:text-brand-maroon transition-colors">
              عرض كل الفعاليات
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 rotate-180"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>

          <EventsCarousel events={upcomingEvents} />
          <div className="mt-10 text-center md:hidden">
            <Link href="/events" className="inline-flex items-center text-brand-maroon font-bold hover:text-brand-gold transition-colors border-b-2 border-brand-maroon pb-1">
              عرض كل الفعاليات
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-brand-gold font-bold text-lg mb-2 block">تحديثات</span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-maroon">آخر الأخبار</h2>
            </div>
            <Link href="/news" className="hidden md:inline-flex items-center text-slate-500 font-bold hover:text-brand-maroon transition-colors">
              عرض كل الأخبار
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 rotate-180"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>

          <NewsCarousel news={latestNews} />
          <div className="mt-10 text-center md:hidden">
            <Link href="/news" className="inline-flex items-center text-brand-maroon font-bold hover:text-brand-gold transition-colors border-b-2 border-brand-maroon pb-1">
              عرض كل الأخبار
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-maroon text-white text-center mb-16 border-y-[8px] border-brand-gold">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">جاهز لترك بصمتك؟</h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            انضم إلينا الآن وكن جزءاً من مجتمع شبابي طموح يسعى للتغيير الإيجابي وبناء المستقبل.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-brand-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-brand-maroon transition shadow-lg">
              تواصل معنا
            </Link>
            <Link href="/events" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition">
              استكشف الفعاليات
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
