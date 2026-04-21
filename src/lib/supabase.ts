import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejdngwgomltcoccdjoup.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZG5nd2dvbWx0Y29jY2Rqb3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NjczOTMsImV4cCI6MjA5MjM0MzM5M30.xXAsdR20xkE_7SEsN9VrTe3htYjnC2SyxyzVY_YA9Yo';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type UserRole = 'professional' | 'employer' | 'admin';

export interface Profile {
  id: string;
  name: string;
  full_name?: string;
  profession: string;
  profession_am?: string;
  city: string;
  sub_city?: string;
  city_am?: string;
  bio: string;
  bio_am?: string;
  rating: number;
  image_url: string;
  phone: string;
  role: UserRole;
  work_history?: string[];
  work_history_am?: string[];
  created_at?: string;
  is_verified?: boolean;
  is_approved?: boolean;
}

export interface UnlockedContact {
  id: string;
  employer_id: string;
  professional_id: string;
  created_at: string;
}

export interface Booking {
  id: string;
  employer_id: string;
  professional_id: string;
  amount: number;
  payment_method: string;
  created_at: string;
}

export const ADMIN_EMAIL = 'admin@huluwork.com';

export async function checkContactAccess(employerId: string, professionalId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase
    .from('unlocked_contacts')
    .select('id')
    .eq('employer_id', employerId)
    .eq('professional_id', professionalId)
    .single();
  
  return !!data && !error;
}

export async function grantContactAccess(employerId: string, professionalId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('unlocked_contacts')
    .insert({
      employer_id: employerId,
      professional_id: professionalId
    });
  
  if (error) throw error;
}

export async function getProfessionalContact(professionalId: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('professional_contacts')
    .select('phone_number')
    .eq('professional_id', professionalId)
    .single();
  
  if (error) {
    // If not in specific contacts table, fallback to profile phone if visible
    const { data: profileData } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', professionalId)
      .single();
    return profileData?.phone || null;
  }
  
  return data?.phone_number || null;
}

export const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Abebe Kebede',
    full_name: 'Abebe Kebede',
    profession: 'Barber',
    profession_am: '\u1340\u1309\u122d \u12a0\u1235\u1270\u12ab\u12ab\u12ed',
    city: 'Bole',
    sub_city: 'Bole',
    city_am: '\u1266\u120c',
    bio: 'Professional barber with 10 years of experience in modern and classic styles.',
    bio_am: '\u1260\u12d8\u1218\u1293\u12ca \u12a5\u1293 \u1260\u1263\u1205\u120b\u12ca \u12e8\u1340\u1309\u122d \u12a0\u1246\u122b\u1228\u1325 \u12e810 \u12d3\u1218\u1275 \u120d\u121d\u12f5 \u12eb\u1208\u12cd \u1263\u1208\u1219\u12eb\u1362',
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1503910368127-b4460c75b5e1?auto=format&fit=crop&q=80&w=300&h=300',
    phone: '+251 911 11 11 11',
    role: 'professional',
    work_history: ['Sheraton Addis', 'Hilton Addis'],
    is_verified: true,
    is_approved: true
  },
  {
    id: '2',
    name: 'Sara Tesfaye',
    full_name: 'Sara Tesfaye',
    profession: 'Private Tutor',
    profession_am: '\u12e8\u130d\u120d \u12a0\u1235\u1270\u121b\u122a',
    city: 'Arada',
    sub_city: 'Arada',
    city_am: '\u12a0\u122b\u12f3',
    bio: 'Specializing in Mathematics and Physics for high school students.',
    bio_am: '\u1208\u12a8\u134d\u1270\u129b \u1201\u1208\u1270\u129b \u12f0\u1228\u1303 \u1270\u121b\u122a\u12ce\u127d \u1260\u1202\u1233\u1265 \u12a5\u1293 \u1260\u134a\u12da\u12ad\u1235 \u1275\u121d\u1205\u122d\u1275 \u120d\u12e9 \u1263\u1208\u1219\u12eb\u1362',
    rating: 4.9,
    image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/aa6840d0-8359-4264-a46e-88df9f9fb3c3/tutor-profile-photo-49e4d4a0-1776798975436.webp',
    phone: '+251 922 22 22 22',
    role: 'professional',
    work_history: ['Lyc\u00e9e Guebre-Mariam', 'International Community School'],
    is_verified: true,
    is_approved: true
  },
  {
    id: '3',
    name: 'Marta Hailu',
    full_name: 'Marta Hailu',
    profession: 'Plumber',
    profession_am: '\u1267\u1295\u1267 \u1230\u122b\u1270\u129b',
    city: 'Kirkos',
    sub_city: 'Kirkos',
    city_am: '\u1242\u122d\u1246\u1235',
    bio: 'Certified plumber with expertise in residential and commercial repairs.',
    bio_am: '\u1260\u1218\u1296\u122a\u12eb \u1264\u1276\u127d \u12a5\u1293 \u1260\u1295\u130d\u12f5 \u1270\u124b\u121b\u1275 \u12e8\u1267\u1295\u1267 \u1325\u1308\u1293 \u12e8\u1270\u1228\u130b\u1308\u1320 \u1263\u1208\u1219\u12eb\u1362',
    rating: 4.7,
    image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/aa6840d0-8359-4264-a46e-88df9f9fb3c3/plumber-profile-photo-3c217db1-1776798975490.webp',
    phone: '+251 933 33 33 33',
    role: 'professional',
    is_verified: true,
    is_approved: true
  }
];