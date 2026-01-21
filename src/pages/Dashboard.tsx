import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MoodSelector from "@/components/dashboard/MoodSelector";
import MoodChart from "@/components/dashboard/MoodChart";
import UpcomingConsultations from "@/components/dashboard/UpcomingConsultations";
import LatestArticles from "@/components/dashboard/LatestArticles";
import PermissionDialog from "@/components/permissions/PermissionDialog";
import { usePermissions } from "@/hooks/usePermissions";

const Dashboard = () => {
  const { needsPermissionPrompts, hasCheckedPermissions } = usePermissions();
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissionsComplete, setPermissionsComplete] = useState(false);

  useEffect(() => {
    // Check if permissions dialog was already shown
    const permissionsShown = localStorage.getItem("permissions_prompted");
    
    if (hasCheckedPermissions && needsPermissionPrompts && !permissionsShown) {
      // Small delay to let the dashboard render first
      const timer = setTimeout(() => {
        setShowPermissions(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasCheckedPermissions, needsPermissionPrompts]);

  const handlePermissionsComplete = () => {
    localStorage.setItem("permissions_prompted", "true");
    setShowPermissions(false);
    setPermissionsComplete(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="pt-[calc(6rem+env(safe-area-inset-top))] md:pt-24 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Mood Section - Full width on mobile */}
            <div className="md:col-span-2 lg:col-span-2 space-y-4">
              <MoodSelector />
              <MoodChart />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <UpcomingConsultations />
              <LatestArticles />
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />

      <PermissionDialog 
        open={showPermissions} 
        onComplete={handlePermissionsComplete} 
      />
    </div>
  );
};

export default Dashboard;
