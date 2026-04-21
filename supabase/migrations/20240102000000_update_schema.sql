-- Update profiles table to include verification and publishing status
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Rename employer_contact_access to unlocked_contacts for consistency with frontend
ALTER TABLE IF EXISTS public.employer_contact_access RENAME TO unlocked_contacts;

-- Ensure RLS is enabled on the renamed table (it should be, but just in case)
ALTER TABLE IF EXISTS public.unlocked_contacts ENABLE ROW LEVEL SECURITY;

-- Create bookings table for transaction logging
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Bookings
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = employer_id OR auth.uid() = professional_id);

CREATE POLICY "Employers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

-- Update RLS for professional_contacts to use the new table name
DROP POLICY IF EXISTS "Employers with access can view professional contact info" ON public.professional_contacts;
CREATE POLICY "Employers with access can view professional contact info"
  ON public.professional_contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.unlocked_contacts
      WHERE employer_id = auth.uid()
      AND professional_id = public.professional_contacts.professional_id
    )
  );

-- Admin logic: we can define a function or just use email checks in policies if needed.
-- For now, we'll allow the admin to update any profile.
-- In a real app, we'd check a service role or a specific user ID.
-- Given the current setup, we'll assume the frontend handles the primary admin check,
-- but let's add a policy that allows the admin (by email) to manage all profiles.

-- Note: auth.jwt() -> 'email' is often used for this.
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (auth.jwt() ->> 'email' = 'admin@huluwork.com') -- Placeholder, will be replaced by the actual admin email if possible
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@huluwork.com');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_employer_id ON public.bookings(employer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_professional_id ON public.bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_is_published ON public.profiles(is_published);