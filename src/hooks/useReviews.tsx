import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  user_id: string;
  expert_id: number;
  consultation_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export const useReviews = (expertId?: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReviews = async () => {
    if (!expertId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("expert_id", expertId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user names for reviews
      const reviewsWithNames = await Promise.all(
        (data || []).map(async (review) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", review.user_id)
            .single();

          return {
            ...review,
            user_name: profileData?.full_name || "Anonimowy użytkownik",
          };
        })
      );

      setReviews(reviewsWithNames);

      // Find user's own review
      if (user) {
        const ownReview = reviewsWithNames.find((r) => r.user_id === user.id);
        setUserReview(ownReview || null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [expertId, user]);

  const addReview = async (
    rating: number,
    comment: string,
    consultationId?: string
  ) => {
    if (!user || !expertId) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany, aby dodać opinię.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        expert_id: expertId,
        consultation_id: consultationId || null,
        rating,
        comment: comment.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Twoja opinia została dodana.",
      });

      await fetchReviews();
      return true;
    } catch (error: any) {
      console.error("Error adding review:", error);
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się dodać opinii.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateReview = async (reviewId: string, rating: number, comment: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          rating,
          comment: comment.trim() || null,
        })
        .eq("id", reviewId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Twoja opinia została zaktualizowana.",
      });

      await fetchReviews();
      return true;
    } catch (error: any) {
      console.error("Error updating review:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować opinii.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Twoja opinia została usunięta.",
      });

      await fetchReviews();
      return true;
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć opinii.",
        variant: "destructive",
      });
      return false;
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    reviews,
    loading,
    userReview,
    averageRating,
    reviewCount: reviews.length,
    addReview,
    updateReview,
    deleteReview,
    refetch: fetchReviews,
  };
};
