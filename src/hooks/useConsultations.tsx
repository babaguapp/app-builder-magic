import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Consultation {
  id: string;
  expert_name: string;
  expert_specialty: string;
  scheduled_at: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
}

export const useConsultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcomingConsultations, setUpcomingConsultations] = useState<Consultation[]>([]);

  const fetchConsultations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_consultations")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;

      const typedData = (data || []) as Consultation[];
      setConsultations(typedData);

      // Filter upcoming consultations
      const now = new Date();
      const upcoming = typedData.filter(
        (c) => new Date(c.scheduled_at) > now && c.status === "scheduled"
      );
      setUpcomingConsultations(upcoming);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [user]);

  return {
    consultations,
    upcomingConsultations,
    loading,
    refetch: fetchConsultations,
  };
};
