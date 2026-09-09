import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'تعرف على مجلس الشباب السوداني بتركيا - رؤيتنا ورسالتنا وأعضاء المكتب التنفيذي. هيئة شبابية وطنية مستقلة تعمل على تمكين الشباب السوداني في تركيا.',
  openGraph: {
    title: 'من نحن | مجلس الشباب السوداني',
    description: 'تعرف على مجلس الشباب السوداني بتركيا - رؤيتنا ورسالتنا وأعضاء المكتب التنفيذي.',
    type: 'website',
  },
};

export const revalidate = 60;

export default async function AboutPage() {
  // Fetch executive office members from Supabase
  const { data: members, error } = await supabase
    .from('executive_office')
    .select('*')
    .order('created_at', { ascending: true });

  const executiveMembers = members || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-maroon text-white py-24 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <span className="text-brand-gold font-bold text-xl mb-4 block">من نحن؟</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">مظلة وطنية جامعة.. لتمكين الكفاءات وصناعة الأثر</h1>
          <p className="text-xl max-w-4xl mx-auto leading-relaxed text-white/90">
            هيئة شبابية وطنية مستقلة، تمثل الإطار الجامع للشباب السوداني في الجمهورية التركية. نعمل على حشد الكفاءات وتوجيه الطاقات، وتوفير بيئة متكاملة للرعاية والتأهيل وبناء الشراكات النوعية، لتعزيز الحضور الإيجابي وتمكين جيل واعٍ يقود المستقبل ويخدم مجتمعه ووطنه.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-2 h-full bg-brand-maroon"></div>
              <h2 className="text-3xl font-bold text-brand-maroon mb-4">رؤيتنا</h2>
              <p className="text-slate-600 leading-loose text-lg">
                ريادةٌ وتمكينٌ مستدام؛ لبناء مجتمع شبابي ملهم ومؤثر، يمتلك أدوات القيادة، ويبني الشراكات الفاعلة، ويمثل وطنه بكفاءة واقتدار.
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-2 h-full bg-brand-gold"></div>
              <h2 className="text-3xl font-bold text-brand-gold mb-4">رسالتنا</h2>
              <p className="text-slate-600 leading-loose text-lg">
                رعاية الطاقات الشبابية وتعزيز مشاركتها الفاعلة في الحياة، عبر مسارات تأهيل نوعية، وشراكات استراتيجية رائدة، ومبادرات متكاملة تصنع قادة الغد وترسخ الانتماء الوطني.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-maroon mb-4">المكتب التنفيذي</h2>
          </div>
          
          {executiveMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {executiveMembers.map(member => (
                <div key={member.id} className="text-center group">
                  <div className="w-36 h-36 mx-auto rounded-full overflow-hidden mb-5 border-4 border-slate-50 group-hover:border-brand-gold transition-colors duration-300 shadow-md bg-slate-100 flex items-center justify-center">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{member.name}</h3>
                  <p className="text-brand-maroon font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10">
              لا توجد بيانات مسجلة في المكتب التنفيذي حالياً.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
