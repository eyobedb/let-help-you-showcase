import { useLanguage } from '../hooks/useLanguage';
import { Profile } from '../lib/supabase';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Star, MapPin, User, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';

interface ProfessionalCardProps {
  profile: Profile;
  isPaid: boolean;
  onViewDetails: () => void;
  index: number;
}

export function ProfessionalCard({ profile, isPaid, onViewDetails, index }: ProfessionalCardProps) {
  const { language, t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-emerald-50 hover:shadow-2xl transition-all duration-500 h-full flex flex-col rounded-[2.5rem] bg-white ring-1 ring-emerald-50/50">
        <CardHeader className="p-0">
          <div className="relative h-72 w-full overflow-hidden">
            <img 
              src={profile.image_url} 
              alt={profile.name || profile.full_name} 
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
              <div className="flex flex-col gap-2">
                {profile.is_verified && (
                  <Badge className="bg-white/95 backdrop-blur-md text-emerald-700 border-none px-4 py-2 text-xs font-black shadow-xl flex items-center gap-2 animate-in fade-in zoom-in duration-500 rounded-full">
                    <ShieldCheck className="h-4 w-4 fill-emerald-100 text-emerald-600" />
                    {t.common.verified}
                  </Badge>
                )}
                {isPaid && (
                  <Badge className="bg-amber-400 text-emerald-900 border-none px-4 py-2 text-xs font-black shadow-xl flex items-center gap-2 rounded-full">
                    <CheckCircle2 className="h-4 w-4" /> Unlocked
                  </Badge>
                )}
              </div>
              
              <Badge className="bg-emerald-900/90 backdrop-blur-md text-amber-400 border-none px-3 py-1.5 text-sm font-black shadow-xl flex items-center gap-1 rounded-full">
                {profile.rating?.toFixed(1) || '5.0'} <Star className="h-3.5 w-3.5 fill-current" />
              </Badge>
            </div>

            <div className="absolute bottom-5 left-5">
              <Badge className="bg-emerald-500/90 text-white border-none backdrop-blur-md px-4 py-1.5 font-bold shadow-lg rounded-full flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {language === 'en' ? (profile.city || profile.sub_city) : (profile.city_am || profile.city)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 flex-grow relative">
          <h3 className="text-2xl font-bold text-emerald-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
            {profile.name || profile.full_name}
          </h3>
          <p className="text-emerald-700 font-bold mb-5 flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            {language === 'en' ? profile.profession : (profile.profession_am || profile.profession)}
          </p>
          
          <p className="text-slate-600 text-sm line-clamp-2 italic leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-emerald-50 shadow-inner group-hover:bg-white transition-colors">
            "{language === 'en' ? profile.bio : (profile.bio_am || profile.bio)}"
          </p>
        </CardContent>
        <CardFooter className="p-8 pt-0">
          <Button 
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl h-14 font-black transition-all transform active:scale-95 shadow-md group-hover:shadow-emerald-100"
            onClick={onViewDetails}
          >
            <Phone className="mr-2 h-5 w-5" />
            {t.directory.viewContact}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}