'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export function GoogleTranslate() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Keep body top at 0px and eliminate any Google banner iframes
    const cleanGoogleUI = () => {
      if (document.body) {
        if (document.body.style.top && document.body.style.top !== '0px') {
          document.body.style.top = '0px';
        }
        if (document.body.style.position && document.body.style.position !== 'static') {
          document.body.style.position = 'static';
        }
      }
      if (document.documentElement && document.documentElement.style.top) {
        document.documentElement.style.top = '0px';
      }

      // Hide all banner frames
      const banners = document.querySelectorAll(
        '.goog-te-banner-frame, iframe[class*="goog-te-banner"], iframe[class*="VIpgJd"], .VIpgJd-ZVi9od-OR2Lfc-ibnAvb, body > .skiptranslate'
      );
      banners.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.display = 'none';
        htmlEl.style.visibility = 'hidden';
        htmlEl.style.height = '0';
        htmlEl.style.width = '0';
      });
    };

    // Run clean immediately and on a rapid interval
    cleanGoogleUI();
    const interval = setInterval(cleanGoogleUI, 300);

    // Also observe DOM changes
    const observer = new MutationObserver(() => {
      cleanGoogleUI();
    });
    observer.observe(document.body, { childList: true, attributes: true, attributeFilter: ['style'] });

    // 2. Define the init function for Google Translate
    window.googleTranslateElementInit = function () {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'ar',
              includedLanguages: 'ar,en,tr',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      } catch (e) {
        console.error('Google Translate init error:', e);
      }

      applyTranslationFromCookie();
      cleanGoogleUI();
    };

    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      window.googleTranslateElementInit();
    } else {
      applyTranslationFromCookie();
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Re-check translation on client-side route changes
  useEffect(() => {
    applyTranslationFromCookie();
  }, [pathname]);

  return (
    <>
      <div
        id="google_translate_element"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      />
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}

export function applyTranslationFromCookie() {
  if (typeof window === 'undefined') return;

  const match = document.cookie.match(/googtrans=\/ar\/([a-z]+)/);
  const target = match ? match[1] : 'ar';

  if (!target || target === 'ar') return;

  let attempts = 0;
  const maxAttempts = 30;
  const interval = setInterval(() => {
    attempts++;
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      if (select.value !== target) {
        select.value = target;
        select.dispatchEvent(new Event('change'));
        try {
          const evt = document.createEvent('HTMLEvents');
          evt.initEvent('change', true, true);
          select.dispatchEvent(evt);
        } catch (e) {}
      }
      clearInterval(interval);
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 200);
}
