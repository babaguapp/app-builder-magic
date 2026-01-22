import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Expert {
  id: string;
  name: string;
  specialty: string;
  category: string;
  bio: string | null;
  city: string;
  gender: "male" | "female";
  rating: number;
  sessions_count: number;
  rate_online: number | null;
  rate_in_person: number | null;
  offers_online: boolean;
  offers_in_person: boolean;
  available_slots_online: unknown;
  available_slots_in_person: unknown;
  education: string[] | null;
  certifications: string[] | null;
  languages: string[] | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpertFilters {
  search?: string;
  category?: string;
  city?: string;
  consultationType?: "all" | "online" | "in_person";
  gender?: "all" | "male" | "female";
  minRating?: number;
  maxPrice?: number;
}

export const useExperts = (filters: ExpertFilters = {}) => {
  return useQuery({
    queryKey: ["experts", filters],
    queryFn: async () => {
      let query = supabase
        .from("experts")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,specialty.ilike.%${filters.search}%`
        );
      }

      if (filters.category && filters.category !== "All") {
        query = query.eq("category", filters.category);
      }

      if (filters.city && filters.city !== "all") {
        query = query.eq("city", filters.city);
      }

      if (filters.consultationType === "online") {
        query = query.eq("offers_online", true);
      } else if (filters.consultationType === "in_person") {
        query = query.eq("offers_in_person", true);
      }

      if (filters.gender && filters.gender !== "all") {
        query = query.eq("gender", filters.gender);
      }

      if (filters.minRating) {
        query = query.gte("rating", filters.minRating);
      }

      if (filters.maxPrice) {
        query = query.or(
          `rate_online.lte.${filters.maxPrice},rate_in_person.lte.${filters.maxPrice}`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Expert[];
    },
  });
};

export const useExpert = (id: string | undefined) => {
  return useQuery({
    queryKey: ["expert", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("experts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Expert;
    },
    enabled: !!id,
  });
};

export const useExpertCities = () => {
  return useQuery({
    queryKey: ["expert-cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experts")
        .select("city")
        .eq("is_active", true);

      if (error) throw error;

      // Get unique cities
      const cities = [...new Set(data.map((e) => e.city))].sort();
      return cities;
    },
  });
};

export const useExpertCategories = () => {
  return useQuery({
    queryKey: ["expert-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experts")
        .select("category")
        .eq("is_active", true);

      if (error) throw error;

      // Get unique categories
      const categories = [...new Set(data.map((e) => e.category))].sort();
      return categories;
    },
  });
};
