import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  User,
  Mail,
  Phone,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  // Initialize form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Błędny format",
        description: "Wybierz plik graficzny (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Plik za duży",
        description: "Maksymalny rozmiar to 5MB",
        variant: "destructive",
      });
      return;
    }

    await uploadAvatar(file);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setFormData({
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
      });
    } else {
      // Start editing
      setFormData({
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({
      full_name: formData.full_name.trim() || null,
      phone: formData.phone.trim() || null,
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const getInitials = () => {
    const name = profile?.full_name || user?.email || "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { icon: Bell, label: "Powiadomienia", href: "/settings/notifications" },
    { icon: Shield, label: "Prywatność i bezpieczeństwo", href: "/settings/privacy" },
    { icon: HelpCircle, label: "Pomoc i wsparcie", href: "/help" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="pt-[calc(6rem+env(safe-area-inset-top))] md:pt-24 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-8 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 max-w-lg">
          {/* Avatar & Name Section */}
          <Card className="gradient-card shadow-card mb-4">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-foreground">
                  {profile?.full_name || "Użytkownik"}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Section */}
          <Card className="gradient-card shadow-card mb-4">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Dane osobowe</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditToggle}
                className="text-primary"
              >
                {isEditing ? "Anuluj" : "Edytuj"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-muted-foreground text-sm">
                  Imię i nazwisko
                </Label>
                {isEditing ? (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="pl-10"
                      placeholder="Jan Kowalski"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">
                      {profile?.full_name || "Nie ustawiono"}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground text-sm">
                  Email
                </Label>
                <div className="flex items-center gap-3 py-2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{user?.email}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-muted-foreground text-sm">
                  Numer telefonu
                </Label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="pl-10"
                      placeholder="+48 123 456 789"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-2">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">
                      {profile?.phone || "Nie ustawiono"}
                    </span>
                  </div>
                )}
              </div>

              {isEditing && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full mt-4"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Zapisuję...
                    </>
                  ) : (
                    "Zapisz zmiany"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Menu Items */}
          <Card className="gradient-card shadow-card mb-4">
            <CardContent className="p-0">
              {menuItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-accent transition-colors ${
                    index !== menuItems.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Sign Out Button */}
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Wyloguj się
          </Button>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Profile;
