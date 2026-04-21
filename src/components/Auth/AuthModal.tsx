import { useState } from 'react';
import { supabase, UserRole } from '../../lib/supabase';
import { useLanguage } from '../../hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('professional');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Logged in successfully');
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { role }
          }
        });
        if (error) throw error;
        
        // If signup is successful, we should also create a profile entry
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              role,
              name: email.split('@')[0], // placeholder
            });
          if (profileError) console.error('Error creating profile:', profileError);
        }
        
        toast.success('Verification email sent! Please check your inbox.');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] border-emerald-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-900">
            {isLogin ? t.auth.login : t.auth.signup}
          </DialogTitle>
          <p className="text-emerald-700/70 text-sm">
            {t.auth.subtitle}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-emerald-100 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-emerald-100 focus:ring-emerald-500"
            />
          </div>

          {!isLogin && (
            <div className="space-y-3 pt-2">
              <Label>{t.auth.role}</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)} className="flex flex-col gap-2">
                <div className="flex items-center space-x-2 border p-3 rounded-lg border-emerald-50 hover:bg-emerald-50/50 transition-colors">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional" className="cursor-pointer font-normal">
                    {t.auth.professional}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg border-emerald-50 hover:bg-emerald-50/50 transition-colors">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label htmlFor="employer" className="cursor-pointer font-normal">
                    {t.auth.employer}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
            disabled={loading}
          >
            {loading ? (isLogin ? t.auth.signingIn : t.auth.signingUp) : (isLogin ? t.auth.login : t.auth.signup)}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-amber-600 hover:underline font-medium"
            >
              {isLogin ? t.auth.noAccount : t.auth.hasAccount}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}