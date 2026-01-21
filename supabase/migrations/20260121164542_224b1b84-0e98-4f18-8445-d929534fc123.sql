-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create moods table
CREATE TABLE public.moods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_value INTEGER NOT NULL CHECK (mood_value >= 1 AND mood_value <= 5),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on moods
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;

-- Moods policies
CREATE POLICY "Users can view their own moods" 
ON public.moods FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own moods" 
ON public.moods FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create mood_shares table (for sharing mood with other users)
CREATE TABLE public.mood_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shared_with_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  share_type TEXT NOT NULL CHECK (share_type IN ('family', 'doctor')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(owner_id, shared_with_id)
);

-- Enable RLS on mood_shares
ALTER TABLE public.mood_shares ENABLE ROW LEVEL SECURITY;

-- Mood shares policies
CREATE POLICY "Users can view their own shares" 
ON public.mood_shares FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can manage their own shares" 
ON public.mood_shares FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own shares" 
ON public.mood_shares FOR DELETE 
USING (auth.uid() = owner_id);

-- Policy for viewing shared moods
CREATE POLICY "Shared users can view moods" 
ON public.moods FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.mood_shares 
    WHERE mood_shares.owner_id = moods.user_id 
    AND mood_shares.shared_with_id = auth.uid()
  )
);

-- Create user_consultations table
CREATE TABLE public.user_consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  expert_name TEXT NOT NULL,
  expert_specialty TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on consultations
ALTER TABLE public.user_consultations ENABLE ROW LEVEL SECURITY;

-- Consultations policies
CREATE POLICY "Users can view their own consultations" 
ON public.user_consultations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consultations" 
ON public.user_consultations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultations" 
ON public.user_consultations FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for updating profiles timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();