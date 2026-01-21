import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, Pill, Calendar } from "lucide-react";

const MobileBottomNav = () => {
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Główna", icon: Home },
    { href: "/experts", label: "Specjaliści", icon: Users },
    { href: "/medications", label: "Leki", icon: Pill },
    { href: "/bookings", label: "Wizyty", icon: Calendar },
    { href: "/posts", label: "Artykuły", icon: FileText },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive(link.href) ? "scale-110" : ""
                }`} 
                strokeWidth={isActive(link.href) ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${
                isActive(link.href) ? "font-semibold" : ""
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
