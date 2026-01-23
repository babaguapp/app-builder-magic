import { SpecialistLayout } from "@/components/specialist/SpecialistLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSpecialistProfile } from "@/hooks/useSpecialistProfile";
import { useSpecialistConsultations } from "@/hooks/useSpecialistConsultations";
import { Calendar, Users, FileText, Star, Loader2 } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { pl } from "date-fns/locale";

const SpecialistDashboard = () => {
  const { data: profile, isLoading: profileLoading } = useSpecialistProfile();
  const { data: consultations = [], isLoading: consultationsLoading } = useSpecialistConsultations();

  const todayConsultations = consultations.filter(c => 
    isToday(new Date(c.scheduled_at)) && c.status === "scheduled"
  );
  
  const upcomingConsultations = consultations.filter(c => 
    new Date(c.scheduled_at) > new Date() && c.status === "scheduled"
  ).slice(0, 5);

  const isLoading = profileLoading || consultationsLoading;

  if (isLoading) {
    return (
      <SpecialistLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </SpecialistLayout>
    );
  }

  if (!profile) {
    return (
      <SpecialistLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nie znaleziono profilu specjalisty. Skontaktuj się z administratorem.
          </p>
        </div>
      </SpecialistLayout>
    );
  }

  return (
    <SpecialistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Witaj, {profile.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), "EEEE, d MMMM yyyy", { locale: pl })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dzisiejsze wizyty
              </CardTitle>
              <Calendar className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{todayConsultations.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Wszystkie sesje
              </CardTitle>
              <Users className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{profile.sessions_count || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ocena
              </CardTitle>
              <Star className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {profile.rating?.toFixed(1) || "0.0"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status
              </CardTitle>
              <FileText className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-foreground">
                {profile.is_active ? "Aktywny" : "Nieaktywny"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Consultations */}
        <Card>
          <CardHeader>
            <CardTitle>Nadchodzące wizyty</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingConsultations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Brak nadchodzących wizyt
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingConsultations.map((consultation) => {
                  const date = new Date(consultation.scheduled_at);
                  let dateLabel = format(date, "d MMM yyyy", { locale: pl });
                  if (isToday(date)) dateLabel = "Dzisiaj";
                  if (isTomorrow(date)) dateLabel = "Jutro";

                  return (
                    <div
                      key={consultation.id}
                      className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {consultation.patient_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {consultation.consultation_type === "in_person" ? "Stacjonarnie" : "Online"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {format(date, "HH:mm")}
                        </p>
                        <p className="text-sm text-muted-foreground">{dateLabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SpecialistLayout>
  );
};

export default SpecialistDashboard;
