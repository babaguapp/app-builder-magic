import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string | null;
  frequency: string;
  times: string[];
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at: string;
  scheduled_time: string | null;
  created_at: string;
}

export const useMedications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: medications, isLoading: medicationsLoading } = useQuery({
    queryKey: ["medications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!user,
  });

  const { data: todayLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["medication_logs", user?.id, new Date().toDateString()],
    queryFn: async () => {
      if (!user) return [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("taken_at", today.toISOString())
        .lt("taken_at", tomorrow.toISOString());
      
      if (error) throw error;
      return data as MedicationLog[];
    },
    enabled: !!user,
  });

  const addMedication = useMutation({
    mutationFn: async (medication: {
      name: string;
      dosage?: string;
      frequency: string;
      times: string[];
      notes?: string;
    }) => {
      if (!user) throw new Error("Nie jesteś zalogowany");
      
      const { data, error } = await supabase
        .from("medications")
        .insert({
          user_id: user.id,
          name: medication.name,
          dosage: medication.dosage || null,
          frequency: medication.frequency,
          times: medication.times,
          notes: medication.notes || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast({
        title: "Lek dodany",
        description: "Lek został dodany do listy.",
      });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: "Nie udało się dodać leku.",
        variant: "destructive",
      });
      console.error("Error adding medication:", error);
    },
  });

  const updateMedication = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Medication> & { id: string }) => {
      if (!user) throw new Error("Nie jesteś zalogowany");
      
      const { data, error } = await supabase
        .from("medications")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast({
        title: "Lek zaktualizowany",
        description: "Zmiany zostały zapisane.",
      });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować leku.",
        variant: "destructive",
      });
      console.error("Error updating medication:", error);
    },
  });

  const deleteMedication = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Nie jesteś zalogowany");
      
      const { error } = await supabase
        .from("medications")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast({
        title: "Lek usunięty",
        description: "Lek został usunięty z listy.",
      });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć leku.",
        variant: "destructive",
      });
      console.error("Error deleting medication:", error);
    },
  });

  const logMedicationTaken = useMutation({
    mutationFn: async ({ medicationId, scheduledTime }: { medicationId: string; scheduledTime?: string }) => {
      if (!user) throw new Error("Nie jesteś zalogowany");
      
      const { data, error } = await supabase
        .from("medication_logs")
        .insert({
          medication_id: medicationId,
          user_id: user.id,
          scheduled_time: scheduledTime || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication_logs"] });
      toast({
        title: "Przyjęto lek",
        description: "Zapisano przyjęcie leku.",
      });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać przyjęcia leku.",
        variant: "destructive",
      });
      console.error("Error logging medication:", error);
    },
  });

  const isMedicationTakenAtTime = (medicationId: string, time: string): boolean => {
    if (!todayLogs) return false;
    return todayLogs.some(
      (log) => log.medication_id === medicationId && log.scheduled_time === time
    );
  };

  return {
    medications: medications || [],
    todayLogs: todayLogs || [],
    isLoading: medicationsLoading || logsLoading,
    addMedication,
    updateMedication,
    deleteMedication,
    logMedicationTaken,
    isMedicationTakenAtTime,
  };
};
