import { useState } from "react";
import { SpecialistLayout } from "@/components/specialist/SpecialistLayout";
import { useSpecialistProfile, useUpdateSpecialistProfile } from "@/hooks/useSpecialistProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save } from "lucide-react";

const SpecialistProfile = () => {
  const { data: profile, isLoading } = useSpecialistProfile();
  const { mutate: updateProfile, isPending } = useUpdateSpecialistProfile();
  
  const [formData, setFormData] = useState({
    bio: "",
    city: "",
    rate_online: "",
    rate_in_person: "",
    offers_online: false,
    offers_in_person: false,
  });
  const [initialized, setInitialized] = useState(false);

  // Initialize form with profile data
  if (profile && !initialized) {
    setFormData({
      bio: profile.bio || "",
      city: profile.city || "",
      rate_online: profile.rate_online?.toString() || "",
      rate_in_person: profile.rate_in_person?.toString() || "",
      offers_online: profile.offers_online || false,
      offers_in_person: profile.offers_in_person || false,
    });
    setInitialized(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      bio: formData.bio,
      city: formData.city,
      rate_online: formData.rate_online ? parseInt(formData.rate_online) : null,
      rate_in_person: formData.rate_in_person ? parseInt(formData.rate_in_person) : null,
      offers_online: formData.offers_online,
      offers_in_person: formData.offers_in_person,
    });
  };

  if (isLoading) {
    return (
      <SpecialistLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </SpecialistLayout>
    );
  }

  if (!profile) {
    return (
      <SpecialistLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nie znaleziono profilu specjalisty.
          </p>
        </div>
      </SpecialistLayout>
    );
  }

  return (
    <SpecialistLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Mój profil
          </h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj swoim profilem specjalisty
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info - Read Only */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Podstawowe informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Imię i nazwisko</Label>
                <p className="font-medium text-foreground">{profile.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Specjalizacja</Label>
                <p className="font-medium text-foreground">{profile.specialty}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Kategoria</Label>
                <p className="font-medium text-foreground">{profile.category}</p>
              </div>
            </CardContent>
          </Card>

          {/* Editable Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Edytowalne informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">Miasto</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="np. Warszawa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">O mnie</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Opisz swoje doświadczenie i specjalizację..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Oferowane usługi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Konsultacje online</p>
                  <p className="text-sm text-muted-foreground">Wideorozmowy z pacjentami</p>
                </div>
                <Switch
                  checked={formData.offers_online}
                  onCheckedChange={(checked) => setFormData({ ...formData, offers_online: checked })}
                />
              </div>

              {formData.offers_online && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label htmlFor="rate_online">Cena za konsultację online (PLN)</Label>
                  <Input
                    id="rate_online"
                    type="number"
                    value={formData.rate_online}
                    onChange={(e) => setFormData({ ...formData, rate_online: e.target.value })}
                    placeholder="np. 150"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Wizyty stacjonarne</p>
                  <p className="text-sm text-muted-foreground">Spotkania w gabinecie</p>
                </div>
                <Switch
                  checked={formData.offers_in_person}
                  onCheckedChange={(checked) => setFormData({ ...formData, offers_in_person: checked })}
                />
              </div>

              {formData.offers_in_person && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label htmlFor="rate_in_person">Cena za wizytę stacjonarną (PLN)</Label>
                  <Input
                    id="rate_in_person"
                    type="number"
                    value={formData.rate_in_person}
                    onChange={(e) => setFormData({ ...formData, rate_in_person: e.target.value })}
                    placeholder="np. 200"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Zapisz zmiany
          </Button>
        </form>
      </div>
    </SpecialistLayout>
  );
};

export default SpecialistProfile;
