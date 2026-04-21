import { useLanguage } from '../../hooks/useLanguage';
import { Profile } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Star, MapPin, Phone, Briefcase, ChevronLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileViewProps {
  profile: Profile;
  isPaid: boolean;
  onBack: () => void;
  onUnlock: () => void;
}

export function ProfileView({ profile, isPaid, onBack, onUnlock }: ProfileViewProps) {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <button 
        onClick={onBack}
        className="flex items-center text-emerald-700 hover:text-emerald-900 font-medium mb-8 group transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        {t.common.back}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar/Photo */}
        <div className="md:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-24"
          >
            <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-2xl mb-6">
              <img 
                src={profile.image_url} 
                alt={profile.name} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <Card className="border-amber-100 bg-amber-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-amber-900 font-bold">{t.profile.rating}</span>
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="h-5 w-5 fill-current mr-1" />
                    {profile.rating}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-emerald-800 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                    {language === 'en' ? profile.city : profile.city_am}
                  </div>
                  <div className="flex items-center text-emerald-800 text-sm">
                    <Briefcase className="h-4 w-4 mr-2 text-emerald-600" />
                    {language === 'en' ? profile.profession : profile.profession_am}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-emerald-900 mb-2">{profile.name}</h1>
            <p className="text-xl text-emerald-700 font-medium mb-6">
              {language === 'en' ? profile.profession : profile.profession_am}
            </p>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-50 mb-8">
              <h2 className="text-lg font-bold text-emerald-900 mb-4 border-b border-emerald-50 pb-2">
                {language === 'en' ? 'About Me' : 'ስለ እኔ'}
              </h2>
              <p className="text-slate-600 leading-relaxed italic text-lg">
                "{language === 'en' ? profile.bio : profile.bio_am}"
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-50 mb-8">
              <h2 className="text-lg font-bold text-emerald-900 mb-4 border-b border-emerald-50 pb-2">
                {t.profile.workHistory}
              </h2>
              <ul className="space-y-4">
                {(profile.work_history || []).map((work, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span className="text-slate-700 font-medium">{work}</span>
                  </li>
                ))}
                {(!profile.work_history || profile.work_history.length === 0) && (
                  <li className="text-slate-400 italic">No work history provided yet.</li>
                )}
              </ul>
            </div>

            <div className="bg-emerald-900 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Phone className="h-24 w-24" />
              </div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {t.profile.contactInfo}
              </h2>
              
              {isPaid ? (
                <div className="flex flex-col gap-2">
                  <span className="text-emerald-200 text-sm uppercase tracking-wider font-bold">Direct Phone</span>
                  <span className="text-3xl font-mono font-bold tracking-tighter text-amber-400">
                    {profile.phone}
                  </span>
                  <Badge className="w-fit mt-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Verified Contact
                  </Badge>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="h-12 w-12 bg-amber-500 rounded-full flex items-center justify-center shrink-0">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-emerald-50 font-medium">
                      {t.profile.unlockToView}
                    </p>
                  </div>
                  <Button 
                    onClick={onUnlock}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-14 text-lg rounded-2xl shadow-lg"
                  >
                    {t.directory.viewContact}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}