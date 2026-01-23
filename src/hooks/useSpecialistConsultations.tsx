import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSpecialistProfile } from "./useSpecialistProfile";
import { toast } from "sonner";

export interface SpecialistConsultation {
  id: string;
  user_id: string;
  expert_id: string;
  expert_name: string;
  expert_specialty: string;
  scheduled_at: string;
  status: string;
  consultation_type: string | null;
  notes: string | null;
  created_at: string;
  patient_name?: string;
}

export const useSpecialistConsultations = (status?: string) => {
  const { data: profile } = useSpecialistProfile();

  return useQuery({
    queryKey: ["specialist-consultations", profile?.id, status],
    queryFn: async () => {
      if (!profile) return [];
      
      let query = supabase
        .from("user_consultations")
        .select("*")
        .eq("expert_id", profile.id)
        .order("scheduled_at", { ascending: true });

      if (status) {
        query = query.eq("status", status);
      }

      const { data: consultations, error } = await query;
      if (error) throw error;

      // Fetch patient names
      const userIds = [...new Set(consultations.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

      return consultations.map(c => ({
        ...c,
        patient_name: profileMap.get(c.user_id) || "Nieznany pacjent",
      })) as SpecialistConsultation[];
    },
    enabled: !!profile,
  });
};

export const useUpdateConsultationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("user_consultations")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialist-consultations"] });
      toast.success("Status wizyty został zaktualizowany");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
