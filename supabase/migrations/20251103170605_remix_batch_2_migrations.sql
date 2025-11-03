
-- Migration: 20251103165719
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create water_bodies table
CREATE TABLE public.water_bodies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lake', 'river', 'reservoir', 'pond', 'well')),
  location JSONB NOT NULL,
  capacity NUMERIC,
  current_level NUMERIC,
  measurements JSONB NOT NULL,
  health_score NUMERIC NOT NULL,
  health_status TEXT NOT NULL CHECK (health_status IN ('excellent', 'good', 'fair', 'poor', 'critical')),
  images TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on water_bodies
ALTER TABLE public.water_bodies ENABLE ROW LEVEL SECURITY;

-- Water bodies policies - users can view all, but only modify their own
CREATE POLICY "Anyone can view water bodies"
  ON public.water_bodies FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own water bodies"
  ON public.water_bodies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own water bodies"
  ON public.water_bodies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own water bodies"
  ON public.water_bodies FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for water_bodies updated_at
CREATE TRIGGER update_water_bodies_updated_at
  BEFORE UPDATE ON public.water_bodies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create index for faster queries
CREATE INDEX idx_water_bodies_user_id ON public.water_bodies(user_id);
CREATE INDEX idx_water_bodies_health_status ON public.water_bodies(health_status);
CREATE INDEX idx_water_bodies_type ON public.water_bodies(type);
CREATE INDEX idx_water_bodies_location ON public.water_bodies USING GIN(location);

-- Migration: 20251103165823
-- Fix search path for handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
