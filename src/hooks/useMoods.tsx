import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Mood {
  id: string;
  mood_value: number;
  note: string | null;
  created_at: string;
}

export const useMoods = () => {
  const { user } = useAuth();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState<Mood | null>(null);

  const fetchMoods = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("moods")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) throw error;

      setMoods(data || []);

      // Check if there's a mood from today
      const today = new Date().toDateString();
      const moodFromToday = data?.find(
        (m) => new Date(m.created_at).toDateString() === today
      );
      setTodayMood(moodFromToday || null);
    } catch (error) {
      console.error("Error fetching moods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, [user]);

  const addMood = async (moodValue: number, note?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("moods")
        .insert({
          user_id: user.id,
          mood_value: moodValue,
          note: note || null,
        })
        .select()
        .single();

      if (error) throw error;

      setMoods((prev) => [data, ...prev]);
      setTodayMood(data);

      toast({
        title: "Nastrój zapisany",
        description: "Dziękujemy za podzielenie się swoim samopoczuciem.",
      });

      return data;
    } catch (error) {
      console.error("Error adding mood:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać nastroju.",
        variant: "destructive",
      });
    }
  };

  const getMoodEmoji = (value: number) => {
    const emojis: Record<number, string> = {
      1: "😢",
      2: "😔",
      3: "😐",
      4: "🙂",
      5: "😊",
    };
    return emojis[value] || "😐";
  };

  const getMoodLabel = (value: number) => {
    const labels: Record<number, string> = {
      1: "Bardzo źle",
      2: "Źle",
      3: "Neutralnie",
      4: "Dobrze",
      5: "Świetnie",
    };
    return labels[value] || "Neutralnie";
  };

  return {
    moods,
    loading,
    todayMood,
    addMood,
    getMoodEmoji,
    getMoodLabel,
    refetch: fetchMoods,
  };
};
