import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { supabase, Profile, UserRole } from '../lib/supabase';
import { ProfileEditor } from '../components/ProfileEditor';
import { Button } from '../components/ui/button';
import { Loader2, LogOut, LayoutDashboard, Briefcase, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function checkUser() {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      }
      setLoading(false);
    }
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-emerald-900 mb-2">
              {t.nav.dashboard}
            </h1>
            <p className="text-emerald-700/70">
              {profile?.full_name} ({profile?.role === 'professional' ? t.auth.professional : t.auth.employer})
            </p>
          </div>
          <div className="flex gap-4">
            {profile?.role === 'employer' && (
              <Button 
                variant="outline" 
                className="border-emerald-200 text-emerald-900 hover:bg-emerald-50"
                onClick={() => navigate('/')}
              >
                <Search className="mr-2 h-4 w-4" />
                {t.directory.title}
              </Button>
            )}
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t.nav.logout}
            </Button>
          </div>
        </div>

        {profile?.role === 'professional' ? (
          <ProfileEditor />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-1 space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-2">Employer Panel</h3>
                <p className="text-sm text-emerald-700/70 mb-6">
                  Manage your hires and unlocked contacts here.
                </p>
                <Button 
                  className="w-full bg-emerald-600"
                  onClick={() => navigate('/')}
                >
                  {t.hero.ctaPrimary}
                </Button>
              </div>
            </motion.div>
            
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-amber-100 shadow-sm text-center">
                <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Ready to hire?</h2>
                <p className="text-emerald-700/70 max-w-md mx-auto mb-8">
                  Browse through our verified professionals and find the perfect match for your needs.
                </p>
                <Button 
                  size="lg" 
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => navigate('/')}
                >
                  {t.directory.searchPlaceholder}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}