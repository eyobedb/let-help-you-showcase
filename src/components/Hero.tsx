import { useLanguage } from '../hooks/useLanguage';
import { Button } from './ui/button';
import { ArrowRight, Briefcase, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onCta: () => void;
}

export function Hero({ onCta }: HeroProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-48 overflow-hidden bg-emerald-900">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[80%] bg-amber-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[90%] bg-emerald-400 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-amber-400/20 text-amber-400 border-amber-400/30 mb-6 py-2 px-4 text-sm font-bold tracking-widest uppercase rounded-full">
              Ethiopia's #1 Skill Marketplace
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100/80 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-white font-black text-lg h-16 px-10 rounded-2xl shadow-2xl hover:shadow-amber-500/40 transition-all group"
                onClick={onCta}
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black text-lg h-16 px-10 rounded-2xl shadow-2xl hover:shadow-amber-500/40 transition-all group"
              >
                {t.hero.ctaSecondary}
                <Briefcase className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/60 font-bold uppercase text-xs tracking-widest">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-400" />
                Verified Pros
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-400" />
                Fast Payment
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-400" />
                Local Support
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Image / Decor */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 pointer-events-none">
        <div className="aspect-[21/9] bg-gradient-to-t from-emerald-950/40 to-white/5 rounded-[40px] backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* We could place a background image here if generated */}
        </div>
      </div>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}