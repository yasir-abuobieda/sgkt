import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-brand-maroon text-white/80 pt-20 pb-8 border-t-4 border-brand-gold mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-extrabold text-white mb-6">مجلس الشباب السوداني</h3>
            <p className="text-white/80 leading-loose mb-8 max-w-sm">
              مؤسسة شبابية رائدة تهدف إلى جمع الكفاءات والطاقات السودانية الشابة لتعزيز التواصل وتقديم مبادرات تخدم المجتمع.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/sugktr/#" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-white transition-all hover:scale-110 shadow-sm border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/sgk.tr" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-white transition-all hover:scale-110 shadow-sm border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="mailto:info@sgkturkiye.org" aria-label="Email" className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-white transition-all hover:scale-110 shadow-sm border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">روابط سريعة</h4>
            <ul className="space-y-4 font-medium text-white/80">
              <li><Link href="/" className="hover:text-brand-gold transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold block"></span>الرئيسية</Link></li>
              <li><Link href="/about" className="hover:text-brand-gold transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold block"></span>عن المجلس</Link></li>
              <li><Link href="/events" className="hover:text-brand-gold transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold block"></span>الفعاليات</Link></li>
              <li><Link href="/news" className="hover:text-brand-gold transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold block"></span>الأخبار</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold block"></span>تواصل معنا</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">تواصل معنا</h4>
            <ul className="space-y-5 font-medium text-white/80">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-brand-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <span>إسطنبول، تركيا</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-brand-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <span dir="ltr" className="text-sm">info@sgkturkiye.org</span>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Copyrights */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-white/60">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} لمجلس الشباب السوداني.</p>
          <p>تم التطوير بواسطة <a href="https://www.linkedin.com/in/yasir-abuobieda-mohammed-fadlalla-4844a9418/" target="_blank" rel="noreferrer" className="text-brand-gold font-bold hover:text-white transition-colors">YASIR ABUOBIEDA</a></p>
        </div>
      </div>
    </footer>
  );
}
