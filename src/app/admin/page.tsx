'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ news: 0, events: 0, gallery: 0 });

  useEffect(() => {
    async function fetchStats() {
      const { count: newsCount } = await supabase.from('news').select('*', { count: 'exact', head: true });
      const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming');
      const { count: galleryCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });

      setStats({
        news: newsCount || 0,
        events: eventsCount || 0,
        gallery: galleryCount || 0
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat Card 1 */}
        <Link href="/admin/news" className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-between transition-all hover:-translate-y-1">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">إجمالي الأخبار</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{stats.news}</h3>
          </div>
          <div className="text-slate-300 group-hover:text-blue-600 transition-colors group-hover:-translate-x-1 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </Link>

        {/* Stat Card 2 */}
        <Link href="/admin/events" className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-between transition-all hover:-translate-y-1">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">الفعاليات القادمة</p>
            <h3 className="text-3xl font-extrabold text-brand-maroon">{stats.events}</h3>
          </div>
          <div className="text-slate-300 group-hover:text-brand-maroon transition-colors group-hover:-translate-x-1 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </Link>

        {/* Stat Card 3 */}
        <Link href="/admin/gallery" className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-between transition-all hover:-translate-y-1">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">صور المعرض</p>
            <h3 className="text-3xl font-extrabold text-brand-gold">{stats.gallery}</h3>
          </div>
          <div className="text-slate-300 group-hover:text-brand-gold transition-colors group-hover:-translate-x-1 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center mt-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">مجلس الشباب السوداني بتركيا</h2>
        <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
          يمثل مجلس الشباب السوداني بتركيا (SGK) المظلة الجامعة للشباب السوداني، حيث نهدف إلى توحيد الطاقات وتطوير المهارات وبناء مجتمع شبابي واعي ومؤثر. 
          نوفر من خلال هذه المنصة أحدث الأخبار، والفعاليات الثقافية والاجتماعية، ليكون الموقع بمثابة جسر تواصل دائم بين شبابنا في تركيا.
        </p>
      </div>
    </div>
  );
}
