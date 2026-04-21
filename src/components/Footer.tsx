import { useLanguage } from '../hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-emerald-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500 text-emerald-900 font-bold">
                H
              </div>
              <span className="text-xl font-bold tracking-tight">
                Hulu-Work <span className="text-amber-500">/ ሁሉ-ስራ</span>
              </span>
            </div>
            <p className="text-emerald-100/70 text-sm max-w-xs">
              {t.footer.tagline}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-amber-500 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-emerald-100/70 text-sm">
              <li><a href="#" className="hover:text-amber-500 transition-colors">{t.nav.findWork}</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">{t.nav.hire}</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">{t.nav.about}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-amber-500 mb-4">Contact</h4>
            <ul className="space-y-2 text-emerald-100/70 text-sm">
              <li>Addis Ababa, Ethiopia</li>
              <li>support@huluwork.et</li>
              <li>+251 11 222 3333</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-emerald-800 text-center text-emerald-100/50 text-xs">
          {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}