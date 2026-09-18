'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { clearCache } from '@/app/actions';

export default function AdminNews() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'أخبار المجلس',
    date: '',
    image: '',
    excerpt: '',
    content: ''
  });

  const [isUploading, setIsUploading] = useState(false);

  // Fetch news from Supabase
  const fetchNews = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setNews(data);
    }
    setIsLoading(false);
    setSelectedIds([]); // Clear selection after fetch
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news;

  // Handle open Add/Edit modal
  const openModal = (item: any = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        title: item.title || '',
        category: 'أخبار المجلس',
        date: item.date || '',
        image: item.image || '',
        excerpt: item.excerpt || '',
        content: item.content || ''
      });
    } else {
      setCurrentItem(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({ title: '', category: 'أخبار المجلس', date: today, image: '', excerpt: '', content: '' });
    }
    setIsModalOpen(true);
  };

  // Handle image upload to Supabase
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `news/${fileName}`;

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentItem) {
      // Edit in Supabase (preserve existing slug)
      const { error } = await supabase.from('news').update(formData).eq('id', currentItem.id);
      if (error) alert('خطأ في التعديل: ' + error.message);
      else {
        await clearCache();
        fetchNews();
      }
    } else {
      // Add to Supabase
      const baseSlug = formData.title.trim().replace(/\s+/g, '-').toLowerCase();
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;
      
      const { error } = await supabase.from('news').insert([{ ...formData, slug: uniqueSlug }]);
      if (error) alert('خطأ في الإضافة: ' + error.message);
      else {
        await clearCache();
        fetchNews();
      }
    }
    setIsModalOpen(false);
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNews.length && filteredNews.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNews.map(item => item.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handle delete
  const confirmDelete = (item: any = null) => {
    setCurrentItem(item); // null means bulk delete
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentItem) {
      // Single delete
      await supabase.from('news').delete().eq('id', currentItem.id);
    } else if (selectedIds.length > 0) {
      // Bulk delete
      await supabase.from('news').delete().in('id', selectedIds);
    }
    await clearCache();
    fetchNews();
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">إدارة الأخبار</h2>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={() => confirmDelete(null)}
              className="bg-red-100 text-red-600 hover:bg-red-200 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              حذف المحدد ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={() => openModal()}
            className="bg-brand-maroon hover:bg-brand-maroon/90 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            إضافة خبر جديد
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-right">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-sm">
            <tr>
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-brand-maroon focus:ring-brand-maroon cursor-pointer"
                  checked={selectedIds.length === filteredNews.length && filteredNews.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4">صورة الخبر</th>
              <th className="p-4">عنوان الخبر</th>
              <th className="p-4">التاريخ</th>
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
            ) : filteredNews.map((item) => (
              <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(item.id) ? 'bg-brand-maroon/5' : ''}`}>
                <td className="p-4 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-brand-maroon focus:ring-brand-maroon cursor-pointer"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="w-16 h-12 rounded bg-slate-200 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-800">{item.title}</td>
                <td className="p-4 text-slate-500 text-sm">{item.date}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => confirmDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && filteredNews.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">لا توجد أخبار مسجلة في هذا القسم.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">{currentItem ? 'تعديل الخبر' : 'إضافة خبر جديد'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">عنوان الخبر</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">التاريخ</label>
                  <input 
                    type="date" 
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon text-right"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">صورة الخبر</label>
                <div className="flex gap-2">
                  <input type="url" dir="ltr" placeholder="رابط URL" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none text-right" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                  <label className={`px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center justify-center border ${isUploading ? 'bg-slate-200 text-slate-400 border-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'}`}>
                    {isUploading ? 'جاري الرفع...' : 'رفع من الجهاز'}
                    <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">مقتطف قصير (يظهر في القائمة)</label>
                <textarea required rows={2} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">المحتوى الكامل</label>
                <textarea required rows={5} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}></textarea>
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
            <p className="text-slate-500 mb-6">
              {currentItem 
                ? 'هل أنت متأكد من حذف هذا الخبر؟ هذا الإجراء لا يمكن التراجع عنه.'
                : `هل أنت متأكد من حذف (${selectedIds.length}) خبر محدد؟ هذا الإجراء لا يمكن التراجع عنه.`
              }
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">إلغاء</button>
              <button onClick={handleDelete} className="px-6 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">نعم، احذف</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
