-- Create experts table
CREATE TABLE public.experts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  category TEXT NOT NULL,
  bio TEXT,
  city TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  rating NUMERIC(2,1) DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  rate_online INTEGER,
  rate_in_person INTEGER,
  offers_online BOOLEAN DEFAULT false,
  offers_in_person BOOLEAN DEFAULT false,
  available_slots_online JSONB DEFAULT '[]'::jsonb,
  available_slots_in_person JSONB DEFAULT '[]'::jsonb,
  education TEXT[],
  certifications TEXT[],
  languages TEXT[] DEFAULT ARRAY['Polski'],
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (experts are publicly viewable)
CREATE POLICY "Experts are publicly viewable" 
ON public.experts 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_experts_updated_at
BEFORE UPDATE ON public.experts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add expert_id to user_consultations table
ALTER TABLE public.user_consultations 
ADD COLUMN expert_id UUID REFERENCES public.experts(id),
ADD COLUMN consultation_type TEXT DEFAULT 'online' CHECK (consultation_type IN ('online', 'in_person'));

-- Insert test data
INSERT INTO public.experts (name, specialty, category, city, gender, rating, sessions_count, rate_online, rate_in_person, offers_online, offers_in_person, bio, education, certifications, languages) VALUES
('Dr. Anna Kowalska', 'Psychologia kliniczna', 'Health', 'Warszawa', 'female', 4.9, 342, 150, 200, true, true, 'Psycholog kliniczny z 15-letnim doświadczeniem w terapii poznawczo-behawioralnej.', ARRAY['Uniwersytet Warszawski - Psychologia', 'Szkoła Wyższa Psychologii Społecznej - Psychoterapia'], ARRAY['Certyfikat CBT', 'Certyfikat EMDR'], ARRAY['Polski', 'Angielski']),
('Dr. Michał Nowak', 'Kardiologia', 'Health', 'Kraków', 'male', 4.8, 521, 180, 250, true, true, 'Kardiolog specjalizujący się w profilaktyce chorób serca i rehabilitacji kardiologicznej.', ARRAY['Collegium Medicum UJ - Medycyna', 'Specjalizacja kardiologiczna'], ARRAY['Europejski Certyfikat Kardiologa'], ARRAY['Polski', 'Angielski', 'Niemiecki']),
('Katarzyna Wiśniewska', 'Dietetyka', 'Health', 'Wrocław', 'female', 5.0, 189, 100, NULL, true, false, 'Dietetyk kliniczny z doświadczeniem w pracy z pacjentami z zaburzeniami odżywiania.', ARRAY['Uniwersytet Przyrodniczy we Wrocławiu - Dietetyka'], ARRAY['Certyfikat Dietetyka Klinicznego'], ARRAY['Polski']),
('Dr. Tomasz Zieliński', 'Psychiatria', 'Health', 'Poznań', 'male', 4.9, 456, 200, 280, true, true, 'Psychiatra z wieloletnim doświadczeniem w leczeniu depresji i zaburzeń lękowych.', ARRAY['Uniwersytet Medyczny w Poznaniu - Medycyna', 'Specjalizacja psychiatryczna'], ARRAY['Certyfikat Psychoterapeuty'], ARRAY['Polski', 'Angielski']),
('Magdalena Dąbrowska', 'Fizjoterapia', 'Health', 'Gdańsk', 'female', 4.7, 298, 80, 120, true, true, 'Fizjoterapeuta specjalizujący się w rehabilitacji pourazowej i terapii manualnej.', ARRAY['AWF Gdańsk - Fizjoterapia'], ARRAY['Certyfikat Terapii Manualnej', 'Certyfikat Kinesiotapingu'], ARRAY['Polski', 'Angielski']),
('Dr. Piotr Lewandowski', 'Dermatologia', 'Health', 'Warszawa', 'male', 4.6, 412, 150, 200, true, true, 'Dermatolog z doświadczeniem w leczeniu chorób skóry i medycynie estetycznej.', ARRAY['Warszawski Uniwersytet Medyczny - Medycyna', 'Specjalizacja dermatologiczna'], ARRAY['Certyfikat Dermatoskopii'], ARRAY['Polski', 'Angielski']);