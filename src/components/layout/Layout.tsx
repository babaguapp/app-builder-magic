import { ReactNode } from "react";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[calc(4rem+env(safe-area-inset-top))] md:pt-20 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
