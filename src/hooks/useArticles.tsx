import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  author_bio: string | null;
  category: string;
  read_time: number;
  likes: number;
  comments: number;
  image_url: string | null;
  created_at: string;
}

export const useArticles = (searchTerm?: string, category?: string) => {
  return useQuery({
    queryKey: ["articles", searchTerm, category],
    queryFn: async () => {
      let query = supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
      }

      if (category && category !== "Wszystkie") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Article[];
    },
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Article;
    },
    enabled: !!id,
  });
};

export const useArticleCategories = () => {
  return useQuery({
    queryKey: ["article-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("category");

      if (error) throw error;
      
      const categories = [...new Set(data.map(a => a.category))];
      return ["Wszystkie", ...categories];
    },
  });
};
