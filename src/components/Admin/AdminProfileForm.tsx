import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { toast } from 'sonner';
import { User, Briefcase, MapPin, Image as ImageIcon, CheckCircle, Save, Loader2, Globe, Sparkles } from 'lucide-react';

interface AdminProfileFormProps {
  onSuccess: () => void;
}

export function AdminProfileForm({ onSuccess }: AdminProfileFormProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    profession_am: '',
    city: '',
    city_am: '',
    bio: '',
    bio_am: '',
    image_url: '',
    phone: '',
    is_verified: true,
    is_approved: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error("Supabase connection not found");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          name: formData.name,
          full_name: formData.name,
          profession: formData.profession,
          profession_am: formData.profession_am || formData.profession,
          city: formData.city,
          sub_city: formData.city,
          city_am: formData.city_am || formData.city,
          bio: formData.bio,
          bio_am: formData.bio_am || formData.bio,
          image_url: formData.image_url,
          phone: formData.phone,
          role: 'professional',
          rating: 5.0,
          is_verified: formData.is_verified,
          is_approved: formData.is_approved,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success(t.admin.success);
      setFormData({
        name: '',
        profession: '',
        profession_am: '',
        city: '',
        city_am: '',
        bio: '',
        bio_am: '',
        image_url: '',
        phone: '',
        is_verified: true,
        is_approved: true
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error uploading profile:', error);
      toast.error(error.message || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-amber-100 shadow-xl overflow-hidden rounded-[2rem]">
      <CardHeader className="bg-emerald-900 text-white p-8">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <Sparkles className="h-7 w-7 text-amber-400" />
          {t.admin.uploadNew}
        </CardTitle>
        <CardDescription className="text-emerald-100/70 text-base italic">
          Upload professional details and set verification status for Hulu-Work marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-emerald-900 font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" /> {t.admin.name}
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 border-emerald-100 focus:ring-amber-400 rounded-xl"
                placeholder="e.g. Abebe Kebede"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-emerald-900 font-bold flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-600" /> {t.profile.phone}
              </Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-12 border-emerald-100 focus:ring-amber-400 rounded-xl"
                placeholder="+251 9... / +251 9..."
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="profession" className="text-emerald-900 font-bold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-emerald-600" /> {t.admin.trade}
              </Label>
              <Input
                id="profession"
                required
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="h-12 border-emerald-100 focus:ring-amber-400 rounded-xl"
                placeholder="e.g. Plumber / ቦንቦ ሠራተኛ"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="city" className="text-emerald-900 font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" /> {t.admin.city}
              </Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="h-12 border-emerald-100 focus:ring-amber-400 rounded-xl"
                placeholder="e.g. Bole / ቦሌ"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="image_url" className="text-emerald-900 font-bold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-emerald-600" /> {t.admin.photoUrl}
              </Label>
              <Input
                id="image_url"
                required
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="h-12 border-emerald-100 focus:ring-amber-400 rounded-xl"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="bio" className="text-emerald-900 font-bold flex items-center gap-2">
                {t.profile.bio}
              </Label>
              <Textarea
                id="bio"
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="min-h-[100px] border-emerald-100 focus:ring-amber-400 rounded-xl"
                placeholder="Brief description / አጭር መግለጫ..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 p-6 bg-slate-50 border border-emerald-50 rounded-2xl">
            <div className="flex items-center justify-between flex-1 bg-white p-4 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <Label htmlFor="is_verified" className="text-emerald-900 font-bold cursor-pointer">{t.admin.isVerified}</Label>
              </div>
              <Switch
                id="is_verified"
                checked={formData.is_verified}
                onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
              />
            </div>

            <div className="flex items-center justify-between flex-1 bg-white p-4 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <Save className="h-5 w-5 text-emerald-600" />
                <Label htmlFor="is_approved" className="text-emerald-900 font-bold cursor-pointer">{t.admin.isApproved}</Label>
              </div>
              <Switch
                id="is_approved"
                checked={formData.is_approved}
                onCheckedChange={(checked) => setFormData({ ...formData, is_approved: checked })}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-emerald-900 font-black h-16 rounded-2xl shadow-xl shadow-amber-200 transition-all transform active:scale-95 text-lg"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin mr-3" /> : <Save className="h-6 w-6 mr-3" />}
            {loading ? t.admin.saving : t.admin.save}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}