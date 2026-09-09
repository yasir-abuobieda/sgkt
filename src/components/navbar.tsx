'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logoSgk from '@/logo.png';

export function Navbar() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('AR');
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Detect current language from cookie
    const match = document.cookie.match(new RegExp('(^| )googtrans=([^;]+)'));
    if (match) {
      const val = decodeURIComponent(match[2]);
      if (val.includes('/en')) setCurrentLang('ENG');
      else if (val.includes('/tr')) setCurrentLang('TR');
      else setCurrentLang('AR');
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    setIsLangOpen(false);
    setIsTranslating(true);

    const target = lang === 'ENG' ? 'en' : lang === 'TR' ? 'tr' : 'ar';

    // 1. Set / Clear googtrans cookie
    if (target === 'ar') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=/ar/ar; path=/;';
      if (window.location.hostname !== 'localhost') {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
        document.cookie = `googtrans=/ar/ar; path=/; domain=.${window.location.hostname};`;
      }
      setTimeout(() => window.location.reload(), 300);
      return;
    } else {
      document.cookie = `googtrans=/ar/${target}; path=/;`;
      if (window.location.hostname !== 'localhost') {
        document.cookie = `googtrans=/ar/${target}; path=/; domain=.${window.location.hostname};`;
      }
    }

    // 2. Trigger translation immediately if widget is in DOM
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = target;
      select.dispatchEvent(new Event('change'));
      try {
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('change', true, true);
        select.dispatchEvent(evt);
      } catch (e) {}

      const isLtr = target === 'en' || target === 'tr';
      document.documentElement.dir = isLtr ? 'ltr' : 'rtl';
      document.documentElement.lang = target;
      
      // Stop animation after translation applies
      setTimeout(() => {
        setIsTranslating(false);
      }, 800);
    } else {
      setTimeout(() => window.location.reload(), 300);
    }
  };

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الفعاليات', href: '/events' },
    { name: 'الأخبار', href: '/news' },
    { name: 'معرض الصور', href: '/gallery' },
    { name: 'عن المجلس', href: '/about' },
    { name: 'تواصل معنا', href: '/contact' },
  ];

  return (
    <>
      <nav className="border-b bg-white sticky top-0 z-50 shadow-sm relative">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition shrink-0">
            <Image 
              src={logoSgk} 
              alt="مجلس الشباب السوداني" 
              className="h-16 md:h-20 w-auto object-contain" 
              priority 
            />
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 font-medium text-slate-600">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-brand-maroon transition">{link.name}</Link>
            ))}
          </div>

          {/* Desktop & Mobile Top-Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-3 ml-2">
              <a href="https://www.facebook.com/sugktr/#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-maroon hover:text-white transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/sgk.tr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-maroon hover:text-white transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="mailto:sudangenclikkonseyi.tr@gmail.com" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-gold hover:text-white transition-colors" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>

            {/* Language Switcher Dropdown */}
            <div className="relative notranslate" ref={dropdownRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all shadow-sm ${
                  isLangOpen ? 'bg-brand-maroon text-white' : 'bg-white border-2 border-slate-100 text-slate-700 hover:border-brand-maroon hover:text-brand-maroon'
                }`}
              >
                {currentLang}
              </button>

              {isLangOpen && (
                <div className="absolute top-12 left-0 w-20 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden flex flex-col py-1 z-50 animate-in fade-in zoom-in duration-200">
                  <button onClick={() => changeLanguage('AR')} className={`px-4 py-2.5 text-sm font-bold text-center transition-colors ${currentLang === 'AR' ? 'text-brand-maroon bg-slate-50' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-maroon'}`}>AR</button>
                  <button onClick={() => changeLanguage('TR')} className={`px-4 py-2.5 text-sm font-bold text-center transition-colors ${currentLang === 'TR' ? 'text-brand-maroon bg-slate-50' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-maroon'}`}>TR</button>
                  <button onClick={() => changeLanguage('ENG')} className={`px-4 py-2.5 text-sm font-bold text-center transition-colors ${currentLang === 'ENG' ? 'text-brand-maroon bg-slate-50' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-maroon'}`}>ENG</button>
                </div>
              )}
            </div>
            
            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg shrink-0 mr-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-24 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-40 md:hidden flex flex-col">
            <div className="flex flex-col p-4 space-y-2 font-bold text-slate-700">
              {navLinks.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="p-3 bg-slate-50 rounded-lg hover:bg-brand-maroon hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4 p-6 border-t border-slate-100 justify-center">
              <a href="https://www.facebook.com/sugktr/#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-maroon hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/sgk.tr" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-maroon hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="mailto:sudangenclikkonseyi.tr@gmail.com" className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-gold hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Fullscreen Translation Loading Overlay */}
      {isTranslating && (
        <div className="fixed inset-0 z-[99999] bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-maroon rounded-full animate-spin mb-4"></div>
          <p className="text-brand-maroon font-bold animate-pulse text-lg tracking-wide">جاري الترجمة...</p>
        </div>
      )}
    </>
  );
}
