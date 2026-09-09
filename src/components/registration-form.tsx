'use client'

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { supabase } from '@/lib/supabase';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-brand-maroon text-white px-4 py-2.5 rounded-lg font-bold hover:bg-brand-maroon/90 disabled:opacity-50 transition w-full mt-1 shadow-md text-sm"
    >
      {pending ? 'جاري الإرسال...' : 'سجل الآن'}
    </button>
  );
}

export function RegistrationForm({ 
  preselectedEventId, 
  preselectedEventTitle,
  onSuccess
}: { 
  preselectedEventId?: string, 
  preselectedEventTitle?: string,
  onSuccess?: () => void
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  async function action(formData: FormData) {
    setStatus(null);
    try {
      const data = Object.fromEntries(formData.entries());
      
      const eventName = data.eventId === '1' ? 'فعالية تعارف الشباب السوداني' : 
                        data.eventId === '4' ? 'مؤتمر الشباب السوداني الأول' : 
                        preselectedEventTitle || 'فعالية غير محددة';

      // Save to Supabase
      const { error: dbError } = await supabase.from('registrations').insert({
        event_id: data.eventId && !isNaN(Number(data.eventId)) ? Number(data.eventId) : null,
        event_title: eventName,
        name: data.name,
        phone: data.phone,
        university: data.city, // Using the university column to store city
        specialty: data.notes  // Using the specialty column to store notes
      });

      if (dbError) {
        console.error("Database Registration Error:", dbError);
        setStatus({ type: 'error', message: "حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى." });
      } else {
        setStatus({ type: 'success', message: 'تم التسجيل بنجاح! شكراً لك.' });
        formRef.current?.reset();
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
        }
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'تأكد من اتصالك بالإنترنت وحاول مجدداً.' });
    }
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3 max-w-md mx-auto">
      {status && (
        <div className={`p-3 rounded-lg text-sm font-bold text-center ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status.message}
        </div>
      )}
      <div>
        <label className="block mb-1 text-xs font-semibold text-slate-600">الاسم الكامل</label>
        <input name="name" required className="w-full border px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-brand-maroon outline-none bg-slate-50" />
      </div>
      <div>
        <label className="block mb-1 text-xs font-semibold text-slate-600">رقم الهاتف / واتساب</label>
        <input name="phone" required type="tel" dir="ltr" className="w-full border px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-brand-maroon outline-none bg-slate-50 text-right" />
      </div>
      <div>
        <label className="block mb-1 text-xs font-semibold text-slate-600">المدينة</label>
        <input name="city" required className="w-full border px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-brand-maroon outline-none bg-slate-50" />
      </div>
      <div>
        <label className="block mb-1 text-xs font-semibold text-slate-600">الفعالية</label>
        {preselectedEventId ? (
          <>
            <input type="hidden" name="eventId" value={preselectedEventId} />
            <input 
              type="text" 
              disabled 
              className="w-full border border-slate-200 px-3 py-2 text-sm rounded-lg bg-slate-100 text-slate-500 font-bold cursor-not-allowed" 
              value={preselectedEventTitle} 
            />
          </>
        ) : (
          <select name="eventId" required className="w-full border px-3 py-2 text-sm rounded-lg text-black focus:ring-2 focus:ring-brand-maroon outline-none bg-slate-50">
            <option value="">اختر الفعالية...</option>
            <option value="1">فعالية تعارف الشباب السوداني</option>
            <option value="4">مؤتمر الشباب السوداني الأول</option>
          </select>
        )}
      </div>
      <div>
        <label className="block mb-1 text-xs font-semibold text-slate-600">ملاحظات إضافية (اختياري)</label>
        <textarea name="notes" className="w-full border px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-brand-maroon outline-none bg-slate-50" rows={2}></textarea>
      </div>
      <SubmitButton />
    </form>
  );
}
