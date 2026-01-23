import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useArticleLikesCount = (articleId: string) => {
  return useQuery({
    queryKey: ["article-likes-count", articleId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("article_likes")
        .select("*", { count: "exact", head: true })
        .eq("article_id", articleId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!articleId,
  });
};

export const useUserLikedArticle = (articleId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["user-liked-article", articleId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from("article_likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!articleId && !!user,
  });
};

export const useToggleArticleLike = (articleId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Musisz być zalogowany, aby polubić artykuł");
      }

      // Check if already liked
      const { data: existingLike } = await supabase
        .from("article_likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from("article_likes")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", user.id);
        
        if (error) throw error;
        return { action: "unliked" };
      } else {
        // Like
        const { error } = await supabase
          .from("article_likes")
          .insert({ article_id: articleId, user_id: user.id });
        
        if (error) throw error;
        return { action: "liked" };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["article-likes-count", articleId] });
      queryClient.invalidateQueries({ queryKey: ["user-liked-article", articleId] });
      
      if (result.action === "liked") {
        toast.success("Polubiono artykuł");
      } else {
        toast.success("Usunięto polubienie");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
