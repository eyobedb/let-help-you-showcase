import { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { Profile, MOCK_PROFILES, supabase } from '../lib/supabase';
import { Hero } from '../components/Hero';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';

interface HomePageProps {
  onViewDetails: (profile: Profile) => void;
  unlockedContacts: string[];
  onCta: () => void;
}

export function HomePage({ onViewDetails, unlockedContacts, onCta }: HomePageProps) {
  const { language, t } = useLanguage();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedProfession, setSelectedProfession] = useState('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!supabase) {
        setProfiles(MOCK_PROFILES.filter(p => p.is_approved));
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'professional')
          .eq('is_approved', true);
        
        if (!error && data) {
          setProfiles(data as Profile[]);
        } else {
          setProfiles(MOCK_PROFILES.filter(p => p.is_approved));
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProfiles = profiles.filter(p => {
    const name = (p.name || p.full_name || '').toLowerCase();
    const profEn = (p.profession || '').toLowerCase();
    const profAm = (p.profession_am || '').toLowerCase();
    const cityEn = (p.city || p.sub_city || '').toLowerCase();
    const cityAm = (p.city_am || '').toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = name.includes(searchLower) || 
                          profEn.includes(searchLower) || 
                          profAm.includes(searchLower);
    
    const matchesCity = selectedCity === 'all' || 
                        cityEn === selectedCity.toLowerCase() || 
                        cityAm === selectedCity.toLowerCase();
                        
    const matchesProfession = selectedProfession === 'all' || 
                              profEn === selectedProfession.toLowerCase() || 
                              profAm === selectedProfession.toLowerCase();
                              
    return matchesSearch && matchesCity && matchesProfession;
  });

  const professions = Array.from(new Set(profiles.map(p => language === 'en' ? p.profession : (p.profession_am || p.profession)).filter(Boolean)));
  const cities = Array.from(new Set(profiles.map(p => language === 'en' ? (p.city || p.sub_city) : (p.city_am || p.city || p.sub_city)).filter(Boolean)));

  return (
    <div className="bg-slate-50">
      <Hero onCta={onCta} />
      
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-emerald-50 mb-16 -mt-24 relative z-10 flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-grow w-full">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest mb-3 block flex items-center gap-2">
              <Search className="h-3 w-3" />
              {t.hero.searchPlaceholder}
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" />
              <Input 
                placeholder={t.hero.searchPlaceholder}
                className="pl-12 h-14 border-slate-100 bg-slate-50/50 rounded-2xl focus:bg-white transition-all text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest mb-3 block flex items-center gap-2">
              <Filter className="h-3 w-3" />
              {t.directory.allProfessions}
            </label>
            <Select value={selectedProfession} onValueChange={setSelectedProfession}>
              <SelectTrigger className="h-14 border-slate-100 bg-slate-50/50 rounded-2xl">
                <SelectValue placeholder={t.directory.allProfessions} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.directory.allProfessions}</SelectItem>
                {professions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-64">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest mb-3 block flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {t.directory.allCities}
            </label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-14 border-slate-100 bg-slate-50/50 rounded-2xl">
                <div className="flex items-center gap-2">
                  <SelectValue placeholder={t.directory.allCities} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.directory.allCities}</SelectItem>
                {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6">{t.directory.title}</h2>
          <div className="h-2 w-32 bg-amber-400 mx-auto rounded-full mb-8" />
          <p className="text-emerald-800/60 max-w-2xl mx-auto text-xl leading-relaxed">{t.hero.subtitle}</p>
        </motion.div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 rounded-3xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProfiles.map((profile, index) => (
              <ProfessionalCard 
                key={profile.id}
                profile={profile}
                isPaid={unlockedContacts.includes(profile.id)}
                onViewDetails={() => onViewDetails(profile)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-[3rem] shadow-inner border border-dashed border-emerald-200"
          >
            <div className="bg-emerald-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-12 w-12 text-emerald-300 animate-spin" />
            </div>
            <p className="text-2xl font-bold text-emerald-900 mb-4 px-4">{t.directory.emptyState}</p>
            <p className="text-slate-500 max-w-md mx-auto">Connecting Ethiopia's top talent with verified employers.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}