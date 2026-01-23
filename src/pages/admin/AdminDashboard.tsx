import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdminData";
import { Users, UserCog, FileText, Calendar, Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    { label: "Użytkownicy", value: stats?.usersCount || 0, icon: Users, color: "text-blue-500" },
    { label: "Eksperci", value: stats?.expertsCount || 0, icon: UserCog, color: "text-green-500" },
    { label: "Artykuły", value: stats?.articlesCount || 0, icon: FileText, color: "text-purple-500" },
    { label: "Konsultacje", value: stats?.consultationsCount || 0, icon: Calendar, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Przegląd statystyk aplikacji
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
