'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminExecutiveOffice() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: ''
  });

  const [isUploading, setIsUploading] = useState(false);

  // Fetch from Supabase
  const fetchMembers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('executive_office').select('*').order('created_at', { ascending: true });
    if (!error && data) {
      setMembers(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle open Add/Edit modal
  const openModal = (member: any = null) => {
    if (member) {
      setCurrentMember(member);
      setFormData(member);
    } else {
      setCurrentMember(null);
      setFormData({ name: '', role: '', image: '' });
    }
    setIsModalOpen(true);
  };

  // Handle image upload to Supabase
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `executive/${fileName}`;

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
    if (currentMember) {
      // Edit in Supabase
      const { error } = await supabase.from('executive_office').update(formData).eq('id', currentMember.id);
      if (!error) fetchMembers();
    } else {
      // Add to Supabase
      const { error } = await supabase.from('executive_office').insert([formData]);
      if (!error) fetchMembers();
    }
    setIsModalOpen(false);
  };

  // Handle delete
  const confirmDelete = (member: any) => {
    setCurrentMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentMember) {
      await supabase.from('executive_office').delete().eq('id', currentMember.id);
      fetchMembers();
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">إدارة المكتب التنفيذي</h2>
        <button 
          onClick={() => openModal()}
          className="bg-brand-maroon hover:bg-brand-maroon/90 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          إضافة عضو جديد
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-sm">
            <tr>
              <th className="p-4 w-24">صورة العضو</th>
              <th className="p-4">اسم العضو</th>
              <th className="p-4">المنصب</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shadow-sm">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-800">{member.name}</td>
                <td className="p-4 text-brand-maroon font-medium text-sm">{member.role}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openModal(member)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => confirmDelete(member)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && members.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">لا يوجد أعضاء مسجلين حالياً. يرجى التأكد من إنشاء الجدول في Supabase.</td>
              </tr>
            )}
            {isLoading && (
               <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">جاري تحميل البيانات...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">{currentMember ? 'تعديل بيانات العضو' : 'إضافة عضو جديد'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">الاسم</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">المنصب</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">الصورة الشخصية</label>
                <div className="flex gap-2">
                  <input type="url" dir="ltr" placeholder="رابط URL" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-maroon focus:outline-none text-right" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                  <label className={`px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center justify-center border ${isUploading ? 'bg-slate-200 text-slate-400 border-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'}`}>
                    {isUploading ? 'جاري الرفع...' : 'رفع من الجهاز'}
                    <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleImageUpload} />
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-2">يفضل استخدام صور مربعة للحصول على أفضل نتيجة.</p>
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
            <p className="text-slate-500 mb-6">هل أنت متأكد من حذف العضو "{currentMember?.name}"؟</p>
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
