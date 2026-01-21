import { useAuth } from "@/contexts/AuthContext";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import pewnaLogo from "@/assets/pewna-logo.svg";

const DashboardHeader = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Dzień dobry";
    if (hour < 18) return "Witaj";
    return "Dobry wieczór";
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name?.split(" ")[0] || "Użytkowniku";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-area-top">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={pewnaLogo} 
              alt="Pewna Logo" 
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Greeting (desktop) */}
          <div className="hidden md:block text-center">
            <p className="text-sm text-muted-foreground">{getGreeting()}</p>
            <p className="font-semibold text-foreground">{getUserName()}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Greeting (mobile) */}
        <div className="md:hidden pb-2">
          <p className="text-lg font-semibold text-foreground">
            <span className="text-sm font-normal text-muted-foreground">{getGreeting()}, </span>
            {getUserName()}.
          </p>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
