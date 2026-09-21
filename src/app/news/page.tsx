'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setNews(data);
      }
      setIsLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="py-20 px-4 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-maroon mb-4">أخبار المجلس</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            تغطية شاملة لآخر تحركاتنا، شراكاتنا، وإنجازات الشباب السوداني.
          </p>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-brand-maroon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map(news => (
              <Link href={`/news/${news.slug}`} key={news.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer block">
                <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-3 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span>{news.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-brand-maroon transition-colors">
                    {news.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 flex-grow leading-relaxed text-sm">
                    {news.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-brand-gold font-bold text-sm">
                    <span>التفاصيل</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 rotate-180"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && news.length === 0 && (
          <div className="text-center py-20 text-slate-500 text-lg font-medium">
            لا توجد أخبار مسجلة حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
