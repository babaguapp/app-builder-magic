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
      <main className="pt-16 md:pt-20 pb-20 md:pb-0">{children}</main>
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
