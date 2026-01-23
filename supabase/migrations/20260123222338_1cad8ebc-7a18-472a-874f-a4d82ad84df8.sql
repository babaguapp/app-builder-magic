-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'specialist');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Link specialists to experts table
ALTER TABLE public.experts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_experts_user_id ON public.experts(user_id);

-- Create consultation_recommendations table
CREATE TABLE public.consultation_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.user_consultations(id) ON DELETE CASCADE NOT NULL,
  expert_id UUID REFERENCES public.experts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_recommendations ENABLE ROW LEVEL SECURITY;

-- Specialists can manage their own recommendations
CREATE POLICY "Specialists can view own recommendations"
ON public.consultation_recommendations
FOR SELECT
USING (
  expert_id IN (SELECT id FROM public.experts WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.user_consultations WHERE id = consultation_id AND user_id = auth.uid())
);

CREATE POLICY "Specialists can insert recommendations"
ON public.consultation_recommendations
FOR INSERT
WITH CHECK (expert_id IN (SELECT id FROM public.experts WHERE user_id = auth.uid()));

CREATE POLICY "Specialists can update recommendations"
ON public.consultation_recommendations
FOR UPDATE
USING (expert_id IN (SELECT id FROM public.experts WHERE user_id = auth.uid()));

CREATE POLICY "Specialists can delete recommendations"
ON public.consultation_recommendations
FOR DELETE
USING (expert_id IN (SELECT id FROM public.experts WHERE user_id = auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_consultation_recommendations_updated_at
BEFORE UPDATE ON public.consultation_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Allow specialists to view consultations assigned to them
CREATE POLICY "Specialists can view their consultations"
ON public.user_consultations
FOR SELECT
USING (expert_id IN (SELECT id FROM public.experts WHERE user_id = auth.uid()));

-- Allow specialists to update their consultations (status)
CREATE POLICY "Specialists can update their consultations"
ON public.user_consultations
FOR UPDATE
USING (expert_id IN (SELECT id FROM public.experts WHERE user_id = auth.uid()));

-- Allow specialists to manage their expert profile
CREATE POLICY "Specialists can update own expert profile"
ON public.experts
FOR UPDATE
USING (user_id = auth.uid());

-- Allow admins full access to experts
CREATE POLICY "Admins can manage experts"
ON public.experts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins full access to articles
CREATE POLICY "Admins can manage articles"
ON public.articles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add author_id to articles for specialists
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);

-- Allow specialists to manage their own articles
CREATE POLICY "Specialists can insert articles"
ON public.articles
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'specialist') 
  AND author_id = auth.uid()
);

CREATE POLICY "Specialists can update own articles"
ON public.articles
FOR UPDATE
USING (author_id = auth.uid());

CREATE POLICY "Specialists can delete own articles"
ON public.articles
FOR DELETE
USING (author_id = auth.uid());