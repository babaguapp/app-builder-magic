import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "specialist";

export const useUserRoles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-roles", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map(r => r.role as AppRole);
    },
    enabled: !!user,
  });
};

export const useIsAdmin = () => {
  const { data: roles = [] } = useUserRoles();
  return roles.includes("admin");
};

export const useIsSpecialist = () => {
  const { data: roles = [] } = useUserRoles();
  return roles.includes("specialist");
};

export const useHasRole = (role: AppRole) => {
  const { data: roles = [] } = useUserRoles();
  return roles.includes(role);
};
