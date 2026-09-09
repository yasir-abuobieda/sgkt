'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setMessages(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: number) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const deleteMessage = async (id: number) => {
    await supabase.from('messages').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const openMessage = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.is_read) markAsRead(msg.id);
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">الرسائل الواردة</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-brand-maroon font-bold mt-1">{unreadCount} رسائل غير مقروءة</p>
          )}
        </div>
        <button
          onClick={fetchMessages}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          title="تحديث"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {([['all', 'الكل'], ['unread', 'غير مقروءة'], ['read', 'مقروءة']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${filter === val ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {label}
            {val === 'unread' && unreadCount > 0 && (
              <span className="mr-1.5 bg-brand-maroon text-white text-xs w-4 h-4 rounded-full inline-flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-brand-maroon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>جاري التحميل...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500">لا توجد رسائل</div>
            ) : filteredMessages.map(msg => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-right p-4 hover:bg-slate-50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-blue-50 border-r-2 border-brand-maroon' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-brand-maroon shrink-0"></span>}
                      <p className={`text-sm truncate ${!msg.is_read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                        {msg.name}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{msg.subject}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{msg.message?.substring(0, 60)}...</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap shrink-0" dir="ltr">
                    {new Date(msg.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{selectedMessage.name}</span>
                    <span>•</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">{selectedMessage.email}</a>
                    <span>•</span>
                    <span dir="ltr">{new Date(selectedMessage.created_at).toLocaleString('en-GB')}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="حذف الرسالة"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-slate-700 leading-loose whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <a
                  href={`mailto:${selectedMessage.email}?subject=رداً على: ${selectedMessage.subject}`}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-maroon text-white rounded-lg font-bold hover:bg-brand-maroon/90 transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  رد عبر البريد الإلكتروني
                </a>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="font-medium">اختر رسالة لعرضها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
