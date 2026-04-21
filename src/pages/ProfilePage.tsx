import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { supabase, Profile, checkContactAccess, grantContactAccess, getProfessionalContact } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { PaymentModal } from '../components/PaymentModal';
import { Star, MapPin, Phone, Briefcase, ArrowLeft, ShieldCheck, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProfile(data);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const hasAccess = await checkContactAccess(user.id, id);
          setIsPaid(hasAccess);
          
          if (hasAccess) {
            const contact = await getProfessionalContact(id);
            setPhoneNumber(contact);
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleUnlock = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error(t.auth.login);
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    if (!id) return;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      try {
        await grantContactAccess(user.id, id);
        setIsPaid(true);
        const contact = await getProfessionalContact(id);
        setPhoneNumber(contact);
        toast.success(t.modal.success);
      } catch (error) {
        console.error('Error granting access after payment:', error);
        toast.error(t.common.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!profile) return <div className="text-center py-20">Profile not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-emerald-900 text-white py-12 mb-[-64px]">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="text-white hover:text-amber-400 mb-8"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.profile.backToDirectory}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-amber-100">
              <div className="aspect-square relative">
                <img 
                  src={profile.image_url || 'https://images.unsplash.com/photo-1503910368127-b4460c75b5e1?auto=format&fit=crop&q=80&w=300&h=300'} 
                  alt={profile.full_name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-emerald-900">{profile.rating || 0}</span>
                </div>
              </div>
              <div className="p-8">
                <h1 className="text-3xl font-bold text-emerald-900 mb-2">{profile.full_name}</h1>
                <div className="flex items-center gap-2 text-emerald-700/80 mb-6">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-medium">{profile.profession}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-800">
                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-700/60 font-medium uppercase tracking-wider">{t.directory.location}</p>
                      <p className="font-bold">{profile.sub_city}, Addis Ababa</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-emerald-800">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isPaid ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                      <Phone className={`h-5 w-5 ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs text-emerald-700/60 font-medium uppercase tracking-wider">{t.profile.phoneNumber}</p>
                      {isPaid ? (
                        <p className="font-bold text-emerald-900">{phoneNumber || profile.phone || 'Contact info empty'}</p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-400">••••••••••</p>
                          <Lock className="h-3 w-3 text-amber-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!isPaid && (
                  <Button 
                    className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6"
                    onClick={handleUnlock}
                  >
                    {t.directory.viewContact}
                  </Button>
                )}
                
                {isPaid && (
                  <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Verified & Unlocked</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-amber-50">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                {t.profile.bio}
              </h2>
              <p className="text-lg text-emerald-800 leading-relaxed">
                {language === 'am' ? (profile.bio_am || profile.bio) : profile.bio}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-amber-50">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-amber-500" />
                {t.profile.workHistory}
              </h2>
              <div className="space-y-6">
                <div className="border-l-2 border-emerald-100 pl-6 relative">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 bg-emerald-600 rounded-full border-4 border-white shadow-sm" />
                  <p className="text-sm font-bold text-emerald-600 mb-1">Current</p>
                  <p className="text-emerald-800">
                    {language === 'am' ? (profile.work_history_am || profile.work_history || 'የሥራ ታሪክ አልተጠቀሰም።') : (profile.work_history || 'No work history specified.')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}