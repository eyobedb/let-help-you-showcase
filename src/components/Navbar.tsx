import { useLanguage } from '../hooks/useLanguage';
import { Button } from './ui/button';
import { LogIn, LogOut, User, Menu, X, ShieldAlert, Home, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { LanguageToggle } from './LanguageToggle';
import { UserRole } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: SupabaseUser | null;
  userRole?: UserRole;
  onLogin: () => void;
  onLogout: () => void;
  onProfile: () => void;
  onHome: () => void;
  isAdmin?: boolean;
}

export function Navbar({ 
  user, 
  userRole, 
  onLogin, 
  onLogout, 
  isAdmin 
}: NavbarProps) {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="h-12 w-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
              <ShieldAlert className="h-7 w-7 text-amber-400" />
            </div>
            <span className="text-2xl font-black text-emerald-900 tracking-tighter">
              HULU<span className="text-amber-500">-WORK</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-emerald-900 font-bold hover:text-amber-600 transition-colors uppercase text-sm tracking-wider">
              {t.nav.findWork}
            </Link>
            <Link to="/" className="text-emerald-900 font-bold hover:text-amber-600 transition-colors uppercase text-sm tracking-wider">
              {t.nav.hire}
            </Link>
            <Link to="/signup" className="text-amber-600 font-bold hover:text-amber-700 transition-colors uppercase text-sm tracking-wider flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {t.nav.partner}
            </Link>
            
            <div className="flex items-center gap-4 ml-4">
              <LanguageToggle />
              
              {user ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Button 
                      onClick={() => navigate('/admin')}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-lg shadow-amber-200/50 px-6 border-none"
                    >
                      <ShieldAlert className="mr-2 h-5 w-5 text-emerald-900" />
                      {t.nav.admin}
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/dashboard')}
                    className="text-emerald-900 font-bold hover:bg-emerald-50 rounded-xl"
                  >
                    <User className="mr-2 h-4 w-4" />
                    {userRole === 'professional' ? t.nav.profile : t.nav.dashboard}
                  </Button>
                  <Button 
                    onClick={onLogout}
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold rounded-xl"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t.nav.logout}
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={onLogin}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all transform active:scale-95"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {t.nav.login}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageToggle />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-50 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link 
            to="/" 
            onClick={() => setIsMenuOpen(false)} 
            className="flex items-center gap-3 w-full p-4 text-emerald-900 font-bold hover:bg-emerald-50 rounded-2xl"
          >
            <Home className="h-5 w-5" />
            {t.nav.findWork}
          </Link>

          <Link 
            to="/signup" 
            onClick={() => setIsMenuOpen(false)} 
            className="flex items-center gap-3 w-full p-4 text-amber-600 font-bold hover:bg-amber-50 rounded-2xl"
          >
            <Briefcase className="h-5 w-5" />
            {t.nav.partner}
          </Link>
          
          {user ? (
            <>
              {isAdmin && (
                <button 
                  onClick={() => { navigate('/admin'); setIsMenuOpen(false); }} 
                  className="flex items-center gap-3 w-full p-4 text-white font-black bg-amber-500 hover:bg-amber-600 border border-amber-600 rounded-2xl shadow-lg"
                >
                  <ShieldAlert className="h-5 w-5 text-emerald-900" />
                  {t.nav.admin}
                </button>
              )}
              <button 
                onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} 
                className="flex items-center gap-3 w-full p-4 text-emerald-900 font-bold hover:bg-emerald-50 rounded-2xl"
              >
                <User className="h-5 w-5" />
                {t.nav.dashboard}
              </button>
              <button 
                onClick={() => { onLogout(); setIsMenuOpen(false); }} 
                className="flex items-center gap-3 w-full p-4 text-red-600 font-bold hover:bg-red-50 rounded-2xl"
              >
                <LogOut className="h-5 w-5" />
                {t.nav.logout}
              </button>
            </>
          ) : (
            <Button 
              onClick={() => { onLogin(); setIsMenuOpen(false); }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 rounded-2xl shadow-lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {t.nav.login}
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}