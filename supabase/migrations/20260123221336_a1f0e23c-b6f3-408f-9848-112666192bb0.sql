-- Create article_likes table to track user likes
CREATE TABLE public.article_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- Users can view all likes (for counting)
CREATE POLICY "Anyone can view likes count"
ON public.article_likes
FOR SELECT
USING (true);

-- Users can insert their own likes
CREATE POLICY "Users can like articles"
ON public.article_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can unlike articles"
ON public.article_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to get article likes count
CREATE OR REPLACE FUNCTION public.get_article_likes_count(article_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.article_likes WHERE article_id = article_uuid;
$$;

-- Create function to check if user liked article
CREATE OR REPLACE FUNCTION public.user_liked_article(article_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.article_likes 
    WHERE article_id = article_uuid AND user_id = user_uuid
  );
$$;