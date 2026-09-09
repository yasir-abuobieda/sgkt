'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { JoinUsButton } from '@/components/registration-modal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function EventsCarousel({ events }: { events: any[] }) {
  if (!events || events.length === 0) {
    return <div className="text-center text-slate-500 py-10">لا توجد فعاليات حالياً.</div>;
  }

  return (
    <div className="relative events-carousel-wrapper">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true, el: '.events-pagination' }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        dir="rtl"
        className="pb-12"
      >
        {events.map((event) => (
          <SwiperSlide key={event.id} className="h-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="relative h-56 w-full overflow-hidden bg-slate-200 shrink-0">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md bg-brand-gold">
                    قريباً
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-brand-maroon mb-4 leading-tight">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <span dir="ltr">{event.date?.includes(' | ') ? event.date.split(' | ')[0] : event.date}</span>
                  {event.date?.includes(' | ') && (
                    <>
                      <span className="mx-1">|</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span dir="ltr">{event.date.split(' | ')[1]}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{event.location}</span>
                </div>
                <div className="mt-auto w-full [&>button]:w-full [&>button]:py-3">
                  <JoinUsButton preselectedEventId={event.id.toString()} preselectedEventTitle={event.title} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="events-pagination flex justify-center mt-8 gap-2"></div>
    </div>
  );
}

export function NewsCarousel({ news }: { news: any[] }) {
  if (!news || news.length === 0) {
    return <div className="text-center text-slate-500 py-10">لا توجد أخبار حالياً.</div>;
  }

  return (
    <div className="relative news-carousel-wrapper">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true, el: '.news-pagination' }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        dir="rtl"
        className="pb-12"
      >
        {news.map((item) => (
          <SwiperSlide key={item.id} className="h-auto">
            <Link href={`/news/${item.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer block">
              <div className="relative h-56 w-full overflow-hidden bg-slate-200 shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur text-brand-maroon px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-3 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-brand-maroon transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 mb-6 flex-grow leading-relaxed text-sm">
                  {item.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-brand-gold font-bold text-sm">
                  <span>التفاصيل</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 rotate-180"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="news-pagination flex justify-center mt-8 gap-2"></div>
    </div>
  );
}
