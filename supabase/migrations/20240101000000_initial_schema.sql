-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  profession TEXT,
  sub_city TEXT,
  photo_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('Professional', 'Employer')),
  rating NUMERIC DEFAULT 0,
  work_history TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create professional_contacts table (separate for access control)
CREATE TABLE IF NOT EXISTS public.professional_contacts (
  professional_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create employer_contact_access table
CREATE TABLE IF NOT EXISTS public.employer_contact_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(employer_id, professional_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_contact_access ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Professional Contacts Policies
CREATE POLICY "Professionals can view their own contact info"
  ON public.professional_contacts FOR SELECT
  USING (auth.uid() = professional_id);

CREATE POLICY "Employers with access can view professional contact info"
  ON public.professional_contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employer_contact_access
      WHERE employer_id = auth.uid()
      AND professional_id = public.professional_contacts.professional_id
    )
  );

CREATE POLICY "Professionals can manage their own contact info"
  ON public.professional_contacts FOR ALL
  USING (auth.uid() = professional_id);

-- Employer Contact Access Policies
CREATE POLICY "Employers can view their own access records"
  ON public.employer_contact_access FOR SELECT
  USING (employer_id = auth.uid());

CREATE POLICY "Professionals can see who has access to them"
  ON public.employer_contact_access FOR SELECT
  USING (professional_id = auth.uid());

-- For simulation purposes, allow employers to "buy" access
CREATE POLICY "Employers can purchase access"
  ON public.employer_contact_access FOR INSERT
  WITH CHECK (employer_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_employer_contact_access_ids ON public.employer_contact_access(employer_id, professional_id);