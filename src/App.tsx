import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Experts from "./pages/Experts";
import ExpertProfile from "./pages/ExpertProfile";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Medications from "./pages/Medications";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminExperts from "./pages/admin/AdminExperts";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminRoles from "./pages/admin/AdminRoles";

// Specialist pages
import SpecialistDashboard from "./pages/specialist/SpecialistDashboard";
import SpecialistCalendar from "./pages/specialist/SpecialistCalendar";
import SpecialistConsultations from "./pages/specialist/SpecialistConsultations";
import SpecialistArticles from "./pages/specialist/SpecialistArticles";
import SpecialistProfile from "./pages/specialist/SpecialistProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/experts" element={
              <ProtectedRoute>
                <Experts />
              </ProtectedRoute>
            } />
            <Route path="/experts/:id" element={
              <ProtectedRoute>
                <ExpertProfile />
              </ProtectedRoute>
            } />
            <Route path="/posts" element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            } />
            <Route path="/posts/:id" element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/medications" element={
              <ProtectedRoute>
                <Medications />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/experts" element={
              <ProtectedRoute>
                <AdminExperts />
              </ProtectedRoute>
            } />
            <Route path="/admin/articles" element={
              <ProtectedRoute>
                <AdminArticles />
              </ProtectedRoute>
            } />
            <Route path="/admin/roles" element={
              <ProtectedRoute>
                <AdminRoles />
              </ProtectedRoute>
            } />

            {/* Specialist routes */}
            <Route path="/specialist" element={
              <ProtectedRoute>
                <SpecialistDashboard />
              </ProtectedRoute>
            } />
            <Route path="/specialist/calendar" element={
              <ProtectedRoute>
                <SpecialistCalendar />
              </ProtectedRoute>
            } />
            <Route path="/specialist/consultations" element={
              <ProtectedRoute>
                <SpecialistConsultations />
              </ProtectedRoute>
            } />
            <Route path="/specialist/articles" element={
              <ProtectedRoute>
                <SpecialistArticles />
              </ProtectedRoute>
            } />
            <Route path="/specialist/profile" element={
              <ProtectedRoute>
                <SpecialistProfile />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
