import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Generate 7 executive members
    const roles = [
      'رئيس المجلس',
      'نائب الرئيس',
      'الأمين العام',
      'أمين الصندوق',
      'مسؤول العلاقات العامة',
      'مسؤول الإعلام',
      'مسؤول العضوية'
    ];

    const membersData = Array.from({ length: 7 }).map((_, i) => {
      return {
        name: `عضو تنفيذي ${i + 1}`,
        role: roles[i],
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
      };
    });

    // Delete existing to avoid duplicates if re-run
    await supabase.from('executive_office').delete().neq('id', 0);

    const { error } = await supabase.from('executive_office').insert(membersData);
    if (error) throw error;

    return NextResponse.json({ message: 'Seeded successfully! 7 executive office members added.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
