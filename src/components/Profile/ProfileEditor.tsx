import { useState, useEffect } from 'react';
import { supabase, Profile } from '../../lib/supabase';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Loader2, Save, User } from 'lucide-react';

interface ProfileEditorProps {
  userId: string;
  onSuccess?: () => void;
}

export function ProfileEditor({ userId, onSuccess }: ProfileEditorProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: '',
    profession: '',
    city: '',
    phone: '',
    bio: '',
    image_url: ''
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) setProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...profile,
          role: 'professional', // Force professional role for this editor
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success(t.profile.success);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border-emerald-100 shadow-xl overflow-hidden">
      <CardHeader className="bg-emerald-600 text-white py-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{t.profile.editorTitle}</CardTitle>
            <p className="text-emerald-100 text-sm opacity-90">Keep your details up to date to get more jobs.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t.profile.fullName}</Label>
            <Input 
              id="name" 
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
              className="border-emerald-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profession">{t.profile.profession}</Label>
            <Input 
              id="profession" 
              value={profile.profession}
              onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
              required
              className="border-emerald-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{t.profile.subCity}</Label>
            <Input 
              id="city" 
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              required
              className="border-emerald-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t.profile.phone}</Label>
            <Input 
              id="phone" 
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              required
              className="border-emerald-100"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="image_url">{t.profile.photo}</Label>
            <Input 
              id="image_url" 
              value={profile.image_url}
              onChange={(e) => setProfile({ ...profile, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="border-emerald-100"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="bio">{t.profile.bio}</Label>
            <Textarea 
              id="bio" 
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="border-emerald-100"
            />
          </div>
          
          <div className="md:col-span-2 pt-4">
            <Button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.profile.saving}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {t.profile.save}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}