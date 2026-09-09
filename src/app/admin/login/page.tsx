'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logoSgk from '@/logo.png';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else if (res.status === 429) {
        setError('محاولات كثيرة جداً. حاول مرة أخرى بعد 15 دقيقة.');
      } else {
        setError('كلمة المرور غير صحيحة');
      }
    } catch {
      setError('حدث خطأ في الاتصال. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 text-center">
        <div className="flex justify-center mb-6">
          <Image src={logoSgk} alt="الشعار" className="h-24 w-auto object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-brand-maroon mb-2">تسجيل الدخول للوحة التحكم</h1>
        <p className="text-slate-500 text-sm mb-8 font-medium">الرجاء إدخال كلمة المرور للمتابعة</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-maroon focus:border-transparent text-center text-lg tracking-widest bg-slate-50"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-maroon text-white font-bold py-3.5 rounded-xl hover:bg-brand-maroon/90 disabled:opacity-70 transition shadow-md"
          >
            {isLoading ? 'جاري التحقق...' : 'دخول آمن'}
          </button>
        </form>
      </div>
    </div>
  );
}
