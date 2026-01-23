import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

export interface ArticleComment {
  id: string;
  user_id: string;
  article_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

const commentSchema = z.object({
  content: z.string()
    .trim()
    .min(1, { message: "Komentarz nie może być pusty" })
    .max(1000, { message: "Komentarz może mieć maksymalnie 1000 znaków" }),
});

export const useArticleComments = (articleId: string) => {
  return useQuery({
    queryKey: ["article-comments", articleId],
    queryFn: async () => {
      const { data: comments, error } = await supabase
        .from("article_comments")
        .select("*")
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user profiles for comments
      const userIds = [...new Set(comments.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

      return comments.map(comment => ({
        ...comment,
        user_name: profileMap.get(comment.user_id) || "Anonim",
      })) as ArticleComment[];
    },
    enabled: !!articleId,
  });
};

export const useArticleCommentsCount = (articleId: string) => {
  return useQuery({
    queryKey: ["article-comments-count", articleId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("article_comments")
        .select("*", { count: "exact", head: true })
        .eq("article_id", articleId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!articleId,
  });
};

export const useAddArticleComment = (articleId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!user) {
        throw new Error("Musisz być zalogowany, aby dodać komentarz");
      }

      // Validate input
      const result = commentSchema.safeParse({ content });
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }

      const { error } = await supabase
        .from("article_comments")
        .insert({
          article_id: articleId,
          user_id: user.id,
          content: result.data.content,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article-comments", articleId] });
      queryClient.invalidateQueries({ queryKey: ["article-comments-count", articleId] });
      toast.success("Dodano komentarz");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteArticleComment = (articleId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) {
        throw new Error("Musisz być zalogowany");
      }

      const { error } = await supabase
        .from("article_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article-comments", articleId] });
      queryClient.invalidateQueries({ queryKey: ["article-comments-count", articleId] });
      toast.success("Usunięto komentarz");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
