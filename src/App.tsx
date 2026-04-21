import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/Auth/AuthModal';
import { ProfileEditor } from './components/Profile/ProfileEditor';
import { ProfileView } from './components/Profile/ProfileView';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { Profile, supabase, ADMIN_EMAIL } from './lib/supabase';
import { Toaster } from './components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';

function AppContent() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [unlockedContacts, setUnlockedContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setUnlockedContacts([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        const profile = data as Profile;
        setUserProfile(profile);
        
        if (profile.role === 'employer') {
          const { data: unlocked } = await supabase
            .from('unlocked_contacts')
            .select('professional_id')
            .eq('employer_id', userId);
          
          if (unlocked) {
            setUnlockedContacts(unlocked.map(u => u.professional_id));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
        <p className="text-emerald-900 font-medium">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-100 selection:text-emerald-900">
      <Navbar 
        user={user} 
        userRole={userProfile?.role}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onProfile={() => {}} // Using router links now
        onHome={() => {}}
        isAdmin={isAdmin}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <HomePage 
              onViewDetails={(p) => { setSelectedProfile(p); setIsPaymentModalOpen(true); }} 
              unlockedContacts={unlockedContacts}
              onCta={() => setIsAuthModalOpen(true)}
            />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          if (selectedProfile) setUnlockedContacts(prev => [...prev, selectedProfile.id]);
        }}
        professionalId={selectedProfile?.id}
        employerId={user?.id}
      />
      
      <Toaster position="top-center" richColors />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;