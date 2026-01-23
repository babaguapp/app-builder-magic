import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Users management
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Experts management
export const useAdminExperts = () => {
  return useQuery({
    queryKey: ["admin-experts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateExpert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("experts")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experts"] });
      toast.success("Ekspert został zaktualizowany");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteExpert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("experts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experts"] });
      toast.success("Ekspert został usunięty");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export type CreateExpertData = {
  name: string;
  specialty: string;
  category: string;
  city: string;
  gender: string;
  bio?: string;
  user_id?: string;
  rate_online?: number;
  rate_in_person?: number;
  offers_online?: boolean;
  offers_in_person?: boolean;
};

export const useCreateExpert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExpertData) => {
      const { error } = await supabase
        .from("experts")
        .insert(data);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experts"] });
      toast.success("Ekspert został dodany");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Articles management
export const useAdminArticles = () => {
  return useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("articles")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast.success("Artykuł został zaktualizowany");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast.success("Artykuł został usunięty");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// User roles management
export const useAdminUserRoles = () => {
  return useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useAddUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "specialist" }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast.success("Rola została przypisana");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useRemoveUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast.success("Rola została usunięta");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, experts, articles, consultations] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("experts").select("*", { count: "exact", head: true }),
        supabase.from("articles").select("*", { count: "exact", head: true }),
        supabase.from("user_consultations").select("*", { count: "exact", head: true }),
      ]);

      return {
        usersCount: users.count || 0,
        expertsCount: experts.count || 0,
        articlesCount: articles.count || 0,
        consultationsCount: consultations.count || 0,
      };
    },
  });
};
