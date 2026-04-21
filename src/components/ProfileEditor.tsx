import { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { supabase, Profile } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { User, Briefcase, MapPin, Phone, FileText, Camera, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileEditor() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({});

  useEffect(() => {
    async function loadProfile() {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...profile,
          id: user.id,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success(t.common.success);
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-amber-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-emerald-900">{t.profile.editProfile}</CardTitle>
            <CardDescription>{t.profile.yourProfile}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t.profile.fullName}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                    <Input
                      id="fullName"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">{t.profile.profession}</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                    <Input
                      id="profession"
                      value={profile.profession || ''}
                      onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                      className="pl-10"
                      placeholder="e.g. Barber, Plumber"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subCity">{t.profile.subCity}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                    <Input
                      id="subCity"
                      value={profile.sub_city || ''}
                      onChange={(e) => setProfile({ ...profile, sub_city: e.target.value })}
                      className="pl-10"
                      placeholder="e.g. Bole, Arada"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t.profile.phoneNumber}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-10"
                      placeholder="+251 ..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t.profile.bio}</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                  <Textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="pl-10 min-h-[120px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t.profile.uploadPhoto}</Label>
                <div className="flex items-center gap-4">
                  {profile.image_url ? (
                    <img 
                      src={profile.image_url} 
                      alt="Profile" 
                      className="h-20 w-20 rounded-full object-cover border-2 border-emerald-100"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-emerald-300" />
                    </div>
                  )}
                  <Input
                    type="text"
                    placeholder="Image URL (Unsplash or similar)"
                    value={profile.image_url || ''}
                    onChange={(e) => setProfile({ ...profile, image_url: e.target.value })}
                    className="flex-grow"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700"
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.profile.saveChanges}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}