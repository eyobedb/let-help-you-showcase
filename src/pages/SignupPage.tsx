import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { supabase, UserRole } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { User, Lock, Mail, Briefcase, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignupPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employer');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Upsert profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            role: role,
            full_name: email.split('@')[0], // Default name
          });

        if (profileError) console.error('Error creating profile:', profileError);
        
        toast.success(t.common.success);
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || t.auth.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md border-amber-100 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-emerald-900">{t.auth.signup}</CardTitle>
            <CardDescription className="text-emerald-700/70">{t.auth.createAccount}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 border-emerald-100 focus:border-amber-400 focus:ring-amber-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 border-emerald-100 focus:border-amber-400 focus:ring-amber-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>{t.auth.role}</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(val) => setRole(val as UserRole)}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="professional" id="professional" className="text-emerald-600" />
                    <Label htmlFor="professional" className="flex items-center gap-2 font-normal cursor-pointer">
                      <Briefcase className="h-4 w-4 text-emerald-600" />
                      {t.auth.professional}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="employer" id="employer" className="text-emerald-600" />
                    <Label htmlFor="employer" className="flex items-center gap-2 font-normal cursor-pointer">
                      <Building2 className="h-4 w-4 text-amber-600" />
                      {t.auth.employer}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-lg"
                disabled={loading}
              >
                {loading ? t.auth.signingUp : t.auth.signup}
              </Button>
              <p className="text-sm text-center text-emerald-700">
                {t.auth.hasAccount}{' '}
                <Link to="/login" className="text-amber-600 font-bold hover:underline">
                  {t.auth.login}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}