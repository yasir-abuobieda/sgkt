'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { JoinUsButton } from '@/components/registration-modal';
import { supabase } from '@/lib/supabase';

export default function EventsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setEvents(data);
      }
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    filter === 'all' ? true : event.status === filter
  );

  return (
    <div className="py-20 px-4 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-maroon mb-4">فعاليات المجلس</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            تعرف على أحدث فعالياتنا ومبادراتنا، وكن جزءاً من مجتمعنا الشبابي الفاعل.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'all' ? 'bg-brand-maroon text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
          >
            الكل
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'upcoming' ? 'bg-brand-gold text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
          >
            الفعاليات القادمة
          </button>
          <button 
            onClick={() => setFilter('past')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'past' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
          >
            الفعاليات السابقة
          </button>
        </div>

        {/* Event Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-brand-maroon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col">
                <div className="relative h-60 w-full overflow-hidden bg-slate-200">
                  {/* Using standard img tag instead of Next Image to avoid requiring a server restart for Unsplash domain config */}
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md ${event.status === 'upcoming' ? 'bg-brand-gold' : 'bg-slate-800'}`}>
                      {event.status === 'upcoming' ? 'قريباً' : 'منتهية'}
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
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{event.location}</span>
                  </div>

                  <p className="text-slate-600 mb-6 flex-grow leading-relaxed">{event.description}</p>
                  
                  {event.status === 'upcoming' ? (
                    <div className="mt-auto w-full">
                      {/* Re-using the JoinUsButton component to trigger the registration modal */}
                      <div className="w-full [&>button]:w-full [&>button]:py-3">
                        <JoinUsButton preselectedEventId={event.id.toString()} preselectedEventTitle={event.title} />
                      </div>
                    </div>
                  ) : (
                    <Link href="/gallery" className="mt-auto bg-slate-100 text-slate-500 px-5 py-3 rounded-lg text-sm font-bold w-full text-center hover:bg-slate-200 transition block">
                      عرض التغطية والصور
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-20 text-slate-500 text-lg font-medium">
            لا توجد فعاليات مطابقة حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
