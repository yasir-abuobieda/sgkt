'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
  const [isRegistrationsLoading, setIsRegistrationsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    status: 'upcoming',
    image: '',
    description: ''
  });

  const [filter, setFilter] = useState('all');

    const [isUploading, setIsUploading] = useState(false);

  // Fetch from Supabase
  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setEvents(data);
    }
    
    // Fetch registration counts
    const { data: regData } = await supabase.from('registrations').select('event_id');
    if (regData) {
      const counts: Record<string, number> = {};
      regData.forEach(reg => {
        if (reg.event_id) {
          counts[reg.event_id] = (counts[reg.event_id] || 0) + 1;
        }
      });
      setRegistrationCounts(counts);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(ev => filter === 'all' ? true : ev.status === filter);

  // Handle open Add/Edit modal
  const openModal = (event: any = null) => {
    if (event) {
      let dateVal = event.date || '';
      let timeVal = event.time || '';
      if (dateVal.includes(' | ')) {
        const parts = dateVal.split(' | ');
        dateVal = parts[0];
        timeVal = parts[1];
      }
      setCurrentEvent(event);
      setFormData({
        ...event,
        date: dateVal,
        time: timeVal
      });
    } else {
      setCurrentEvent(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({ title: '', location: '', date: today, time: '', status: 'upcoming', image: '', description: '' });
    }
    setIsModalOpen(true);
  };

  // Handle image upload to Supabase
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `events/${fileName}`;

    setIsUploading(true);
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    
    if (uploadError) {
      alert('خطأ في رفع الصورة: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    setFormData({ ...formData, image: data.publicUrl });
    setIsUploading(false);
  };

  // Handle save (Add/Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a payload and remove the 'time' property
    const payload: any = { ...formData };
    delete payload.time;
    
    // Merge time into date string if time is provided
    if (formData.time) {
      payload.date = `${formData.date} | ${formData.time}`;
    }

    if (currentEvent) {
      // Edit in Supabase
      const { error } = await supabase.from('events').update(payload).eq('id', currentEvent.id);
      if (error) {
        alert('خطأ في التعديل: ' + error.message);
      } else {
        fetchEvents();
        setIsModalOpen(false);
      }
    } else {
      // Add to Supabase
      const { error } = await supabase.from('events').insert([payload]);
      if (error) {
        alert('خطأ في الإضافة: ' + error.message);
      } else {
        fetchEvents();
        setIsModalOpen(false);
      }
    }
  };

  // Handle delete
  const confirmDelete = (event: any) => {
    setCurrentEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentEvent) {
      await supabase.from('events').delete().eq('id', currentEvent.id);
      fetchEvents();
    }
    setIsDeleteModalOpen(false);
  };

  // View Registrations
  const viewRegistrations = async (event: any) => {
    setCurrentEvent(event);
    setIsRegistrationsModalOpen(true);
    setIsRegistrationsLoading(true);
    
    const { data } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', event.id)
      .order('created_at', { ascending: false });
      
    setEventRegistrations(data || []);
    setIsRegistrationsLoading(false);
  };

  // Export registrations to CSV
  const exportToCSV = () => {
    if (eventRegistrations.length === 0) return;
    
    const headers = ['الاسم', 'رقم الهاتف', 'المدينة', 'ملاحظات', 'تاريخ التسجيل'];
    
    const rows = eventRegistrations.map(reg => [
      `"${(reg.name || '').replace(/"/g, '""')}"`,
      `"${(reg.phone || '').replace(/"/g, '""')}"`,
      `"${(reg.university || '').replace(/"/g, '""')}"`,
      `"${(reg.specialty || '').replace(/"/g, '""')}"`,
      `"${new Date(reg.created_at).toLocaleDateString('en-GB')}"`
    ]);
    
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `مسجلي_${currentEvent?.title || 'event'}_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">إدارة الفعاليات</h2>
        <button 
          onClick={() => openModal()}
          className="bg-brand-maroon hover:bg-brand-maroon/90 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          إضافة فعالية جديدة
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          الكل
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${filter === 'upcoming' ? 'bg-brand-gold text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          الفعاليات القادمة
        </button>
        <button 
          onClick={() => setFilter('past')}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${filter === 'past' ? 'bg-brand-maroon text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          الفعاليات السابقة
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-sm">
            <tr>
              <th className="p-4">صورة الفعالية</th>
              <th className="p-4">عنوان الفعالية</th>
              <th className="p-4 text-center">المسجلين</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-brand-maroon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>جاري التحميل...</span>
                  </div>
                </td>
              </tr>
            ) : filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="w-16 h-12 rounded bg-slate-200 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-800">{event.title}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => viewRegistrations(event)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    {registrationCounts[event.id] || 0}
                  </button>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {event.status === 'upcoming' ? 'قريباً' : 'منتهية'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openModal(event)} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors" title="تعديل">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => confirmDelete(event)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && filteredEvents.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">لا توجد فعاليات في هذا القسم.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">{currentEvent ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">عنوان الفعالية</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">المكان</label>
                  <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">التاريخ</label>
                  <input required type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none text-right" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الساعة</label>
                  <input required type="time" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none text-right" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الحالة</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="upcoming">قريباً</option>
                    <option value="past">منتهية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">صورة الفعالية</label>
                  <div className="flex gap-2">
                    <input type="url" dir="ltr" placeholder="رابط URL" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none text-right" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                    <label className={`px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center justify-center border ${isUploading ? 'bg-slate-200 text-slate-400 border-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'}`}>
                      {isUploading ? 'جاري الرفع...' : 'رفع من الجهاز'}
                      <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">التفاصيل</label>
                <textarea required rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">إلغاء</button>
                <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white bg-brand-maroon hover:bg-brand-maroon/90 transition-colors">حفظ التغييرات</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">تأكيد الحذف</h3>
            <p className="text-slate-500 mb-6">هل أنت متأكد من حذف هذه الفعالية؟ هذا الإجراء لا يمكن التراجع عنه.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">إلغاء</button>
              <button onClick={handleDelete} className="px-6 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">نعم، احذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Registrations Modal */}
      {isRegistrationsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">قائمة المسجلين</h3>
                <p className="text-sm text-slate-500 mt-1">{currentEvent?.title}</p>
              </div>
              <button onClick={() => setIsRegistrationsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-0">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold sticky top-0">
                  <tr>
                    <th className="p-4">الاسم</th>
                    <th className="p-4">الهاتف</th>
                    <th className="p-4">المدينة</th>
                    <th className="p-4">ملاحظات</th>
                    <th className="p-4">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isRegistrationsLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : eventRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                        لم يقم أحد بالتسجيل في هذه الفعالية بعد.
                      </td>
                    </tr>
                  ) : (
                    eventRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{reg.name}</td>
                        <td className="p-4 text-slate-600" dir="ltr">{reg.phone}</td>
                        <td className="p-4 text-slate-600">{reg.university || '-'}</td>
                        <td className="p-4 text-slate-500 max-w-[200px] truncate" title={reg.specialty || ''}>{reg.specialty || '-'}</td>
                        <td className="p-4 text-slate-500" dir="ltr">
                          {new Date(reg.created_at).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-slate-600 font-bold">الإجمالي: {eventRegistrations.length}</span>
              <div className="flex gap-2">
                <button 
                  onClick={exportToCSV}
                  disabled={eventRegistrations.length === 0}
                  className="px-5 py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  تصدير CSV
                </button>
                <button 
                  onClick={() => setIsRegistrationsModalOpen(false)} 
                  className="px-6 py-2 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
