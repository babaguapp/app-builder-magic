import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ExpertProfile {
  id: string;
  user_id: string | null;
  name: string;
  specialty: string;
  category: string;
  bio: string | null;
  avatar_url: string | null;
  city: string;
  gender: string;
  languages: string[] | null;
  education: string[] | null;
  certifications: string[] | null;
  rate_online: number | null;
  rate_in_person: number | null;
  offers_online: boolean | null;
  offers_in_person: boolean | null;
  available_slots_online: any;
  available_slots_in_person: any;
  is_active: boolean | null;
  rating: number | null;
  sessions_count: number | null;
}

export const useSpecialistProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["specialist-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("experts")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as ExpertProfile | null;
    },
    enabled: !!user,
  });
};

export const useUpdateSpecialistProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<ExpertProfile>) => {
      if (!user) throw new Error("Nie jesteś zalogowany");

      const { error } = await supabase
        .from("experts")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialist-profile"] });
      toast.success("Profil został zaktualizowany");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
