import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsSpecialist } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  ClipboardList,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SpecialistLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/specialist", label: "Dashboard", icon: LayoutDashboard },
  { href: "/specialist/calendar", label: "Kalendarz wizyt", icon: Calendar },
  { href: "/specialist/consultations", label: "Wizyty i zalecenia", icon: ClipboardList },
  { href: "/specialist/articles", label: "Moje artykuły", icon: FileText },
  { href: "/specialist/profile", label: "Mój profil", icon: User },
];

export const SpecialistLayout = ({ children }: SpecialistLayoutProps) => {
  const { signOut } = useAuth();
  const isSpecialist = useIsSpecialist();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isSpecialist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Brak dostępu</h1>
          <p className="text-muted-foreground mb-4">Nie masz uprawnień specjalisty.</p>
          <Button onClick={() => navigate("/")}>Wróć do strony głównej</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <h1 className="font-display text-xl font-bold text-foreground">Panel Specjalisty</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border space-y-2">
            <Link to="/" className="block">
              <Button variant="outline" className="w-full justify-start">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Wróć do aplikacji
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj się
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 lg:ml-0 ml-0 pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
};
