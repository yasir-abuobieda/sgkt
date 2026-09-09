'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RegistrationForm } from './registration-form';

export function JoinUsButton({ 
  preselectedEventId, 
  preselectedEventTitle 
}: { 
  preselectedEventId?: string, 
  preselectedEventTitle?: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand-maroon text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-brand-maroon/90 transition shadow-md"
      >
        انضم إلينا
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto p-5 relative custom-scrollbar">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="mt-2">
              <h2 className="text-xl font-bold text-center text-brand-maroon mb-1">التسجيل والانضمام</h2>
              <p className="text-center text-slate-500 mb-4 text-xs">يرجى تعبئة النموذج أدناه للتسجيل في فعالياتنا ومبادراتنا.</p>
              <RegistrationForm 
                preselectedEventId={preselectedEventId} 
                preselectedEventTitle={preselectedEventTitle} 
                onSuccess={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
