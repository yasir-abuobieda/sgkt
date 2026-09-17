'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function GalleryContent() {
  const searchParams = useSearchParams();
  const eventIdParam = searchParams.get('event_id');
  const eventId = eventIdParam ? parseInt(eventIdParam) : null;
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      
      // If there's an eventId, fetch its details
      if (eventId) {
        const { data: eventData } = await supabase.from('events').select('title').eq('id', eventId).single();
        if (eventData) setEventDetails(eventData);
      }
      
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setGalleryImages(data);
      }
      setIsLoading(false);
    };
    fetchGallery();
  }, [eventId]);

  // Filter images by eventId if provided
  const filteredImages = eventId 
    ? galleryImages.filter(img => img.event_id === eventId)
    : galleryImages;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') {
        // User requested: Right arrow goes to next image
        setSelectedIndex(prev => prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0);
      } else if (e.key === 'ArrowLeft') {
        // User requested: Left arrow goes to previous image
        setSelectedIndex(prev => prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1);
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredImages.length]);

  return (
    <div className="py-20 px-4 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          {eventId && eventDetails ? (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-brand-maroon mb-4">تغطية فعالية</h1>
              <h2 className="text-2xl font-bold text-brand-gold mb-6">{eventDetails.title}</h2>
              <Link href="/gallery" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-full transition-colors mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                العودة للمعرض الشامل
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-brand-maroon mb-4">معرض الصور</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                نافذة بصرية توثق أبرز محطاتنا، فعالياتنا، ومشاركات الشباب السوداني في تركيا.
              </p>
            </>
          )}
        </div>


        {/* Masonry / Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredImages.map((img, index) => (
            <div 
              key={img.id} 
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedIndex(index)}
            >
              <img 
                src={img.src} 
                alt="صورة في المعرض" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              {/* Overlay for hover effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && !isLoading && (
          <div className="text-center py-20 text-slate-500 font-medium">
            لا توجد صور في هذا القسم حالياً.
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4"
          onClick={() => setSelectedIndex(null)}
          dir="rtl"
        >
          {/* Close button */}
          <button 
            className="absolute top-6 left-6 md:right-6 md:left-auto text-white/70 hover:text-white bg-slate-800/50 hover:bg-brand-maroon rounded-full p-2 transition-colors z-[60]"
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Right Arrow (Next Image) */}
          <button 
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-slate-800/50 hover:bg-brand-maroon rounded-full p-3 transition-colors z-[60]"
            onClick={(e) => { 
              e.stopPropagation(); 
              setSelectedIndex(prev => prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0); 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          {/* Left Arrow (Previous Image) */}
          <button 
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-slate-800/50 hover:bg-brand-maroon rounded-full p-3 transition-colors z-[60]"
            onClick={(e) => { 
              e.stopPropagation(); 
              setSelectedIndex(prev => prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1); 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div 
            className="max-w-5xl w-full max-h-[85vh] relative flex flex-col items-center animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={filteredImages[selectedIndex].src} 
              alt="صورة" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            {/* Image counter optional */}
            <div className="absolute -bottom-10 text-white/60 font-medium tracking-wider">
              {selectedIndex + 1} / {filteredImages.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <svg className="animate-spin h-10 w-10 text-brand-maroon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
