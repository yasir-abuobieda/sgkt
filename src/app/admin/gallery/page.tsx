'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    src: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  // Fetch from Supabase
  const fetchGallery = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setImages(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredImages = images;

  // Handle open Add/Edit modal
  const openModal = (item: any = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData(item);
    } else {
      setCurrentItem(null);
      setFormData({ title: '', category: '', src: '' });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setIsUploading(true);

    let uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      
      if (!uploadError) {
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      } else {
        alert(`خطأ في رفع الصورة ${file.name}: ${uploadError.message}`);
      }
    }

    if (uploadedUrls.length > 0) {
      if (currentItem) {
        // Edit mode: update the current item with the first image
        await supabase.from('gallery').update({ src: uploadedUrls[0] }).eq('id', currentItem.id);
        // If more than 1 uploaded, insert the rest as new
        if (uploadedUrls.length > 1) {
          const newInserts = uploadedUrls.slice(1).map(url => ({ title: '', category: '', src: url }));
          await supabase.from('gallery').insert(newInserts);
        }
      } else {
        // Add mode: insert all
        const newInserts = uploadedUrls.map(url => ({ title: '', category: '', src: url }));
        await supabase.from('gallery').insert(newInserts);
      }
      fetchGallery();
      setIsModalOpen(false);
    }
    
    setIsUploading(false);
  };

  // Handle save (Add/Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentItem) {
      // Edit in Supabase
      const { error } = await supabase.from('gallery').update(formData).eq('id', currentItem.id);
      if (!error) fetchGallery();
    } else {
      // Add to Supabase
      const { error } = await supabase.from('gallery').insert([formData]);
      if (!error) fetchGallery();
    }
    setIsModalOpen(false);
  };

  // Handle delete
  const confirmDelete = (item: any) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentItem) {
      await supabase.from('gallery').delete().eq('id', currentItem.id);
      fetchGallery();
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">إدارة معرض الصور</h2>
        <button 
          onClick={() => openModal()}
          className="bg-brand-maroon hover:bg-brand-maroon/90 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          رفع صورة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredImages.map((img) => (
          <div key={img.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
            <div className="h-40 w-full overflow-hidden">
              <img src={img.src} alt="صورة" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div className="mt-4 flex gap-2">
                <button onClick={() => openModal(img)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs py-2 rounded font-bold transition-colors">تعديل</button>
                <button onClick={() => confirmDelete(img)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs py-2 rounded font-bold transition-colors">حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 mt-6">
          لا توجد صور مسجلة في هذا القسم.
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">{currentItem ? 'تعديل الصورة' : 'رفع صورة جديدة'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">ملف الصورة</label>
                <div className="flex gap-2">
                  <input type="url" dir="ltr" placeholder="رابط URL" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none text-right" value={formData.src} onChange={e => setFormData({...formData, src: e.target.value})} />
                  <label className={`px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center justify-center border ${isUploading ? 'bg-slate-200 text-slate-400 border-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'}`}>
                    {isUploading ? 'جاري الرفع...' : 'رفع من الجهاز'}
                    <input type="file" accept="image/*" multiple className="hidden" disabled={isUploading} onChange={handleImageUpload} />
                  </label>
                </div>

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
            <p className="text-slate-500 mb-6">هل أنت متأكد من حذف هذه الصورة؟ هذا الإجراء لا يمكن التراجع عنه.</p>
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
