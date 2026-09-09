'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const { error } = await supabase.from('messages').insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        is_read: false,
      });

      if (error) {
        setStatus({ type: 'error', message: 'حدث خطأ أثناء إرسال رسالتك، يرجى المحاولة مرة أخرى.' });
      } else {
        setStatus({ type: 'success', message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' });
        formRef.current?.reset();
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'تأكد من اتصالك بالإنترنت وحاول مجدداً.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-20 px-4 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-maroon mb-4">تواصل معنا</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            نحن هنا للاستماع إليك. سواء كان لديك استفسار، اقتراح، أو ترغب في التعاون معنا، لا تتردد في مراسلتنا.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Contact Info Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6">معلومات التواصل</h3>
              
              <div className="flex items-start gap-4 mb-6 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-brand-maroon/10 flex items-center justify-center text-brand-maroon shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1">رقم الهاتف</p>
                  <p dir="ltr" className="text-right">+90 531 435 73 00</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-brand-maroon/10 flex items-center justify-center text-brand-maroon shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1">البريد الإلكتروني</p>
                  <p>sudangenclikkonseyi.tr@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-brand-maroon/10 flex items-center justify-center text-brand-maroon shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1">العنوان</p>
                  <p>إسطنبول، تركيا</p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">أرسل لنا رسالة</h3>
              
              {status && (
                <div className={`p-4 rounded-lg mb-6 text-sm font-bold ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {status.message}
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل *</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon transition bg-slate-50 focus:bg-white"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon transition bg-slate-50 focus:bg-white"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الموضوع *</label>
                  <input 
                    type="text" 
                    name="subject" 
                    required 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon transition bg-slate-50 focus:bg-white"
                    placeholder="موضوع الرسالة (مثال: اقتراح شراكة)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الرسالة *</label>
                  <textarea 
                    name="message" 
                    required 
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon transition bg-slate-50 focus:bg-white resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-brand-maroon text-white px-8 py-3.5 rounded-lg font-bold hover:bg-brand-maroon/90 disabled:opacity-70 transition w-full md:w-auto shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'جاري الإرسال...'
                  ) : (
                    <>
                      <span>إرسال الرسالة</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
