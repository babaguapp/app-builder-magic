import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSpecialistProfile } from "./useSpecialistProfile";
import { toast } from "sonner";
import { z } from "zod";

export interface Recommendation {
  id: string;
  consultation_id: string;
  expert_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const recommendationSchema = z.object({
  content: z.string()
    .trim()
    .min(1, { message: "Zalecenie nie może być puste" })
    .max(5000, { message: "Zalecenie może mieć maksymalnie 5000 znaków" }),
});

export const useConsultationRecommendation = (consultationId: string) => {
  return useQuery({
    queryKey: ["recommendation", consultationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultation_recommendations")
        .select("*")
        .eq("consultation_id", consultationId)
        .maybeSingle();

      if (error) throw error;
      return data as Recommendation | null;
    },
    enabled: !!consultationId,
  });
};

export const useSaveRecommendation = () => {
  const { data: profile } = useSpecialistProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ consultationId, content, existingId }: { 
      consultationId: string; 
      content: string;
      existingId?: string;
    }) => {
      if (!profile) throw new Error("Brak profilu specjalisty");

      const result = recommendationSchema.safeParse({ content });
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }

      if (existingId) {
        const { error } = await supabase
          .from("consultation_recommendations")
          .update({ content: result.data.content })
          .eq("id", existingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("consultation_recommendations")
          .insert({
            consultation_id: consultationId,
            expert_id: profile.id,
            content: result.data.content,
          });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recommendation", variables.consultationId] });
      toast.success("Zalecenie zostało zapisane");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
