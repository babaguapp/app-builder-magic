import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";
import { useConsultations } from "@/hooks/useConsultations";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Link } from "react-router-dom";

const UpcomingConsultations = () => {
  const { upcomingConsultations, loading } = useConsultations();

  if (loading) {
    return (
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Nadchodzące wizyty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Ładowanie...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card shadow-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg font-semibold whitespace-nowrap">Nadchodzące wizyty</CardTitle>
        <Link to="/bookings" className="shrink-0">
          <Button variant="ghost" size="sm" className="text-primary text-xs px-2">
            Zobacz wszystkie
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {upcomingConsultations.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Brak nadchodzących wizyt</p>
            <Link to="/bookings">
              <Button variant="link" className="mt-2">
                Umów wizytę
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingConsultations.slice(0, 3).map((consultation) => {
              const date = new Date(consultation.scheduled_at);
              return (
                <div
                  key={consultation.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {consultation.expert_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {consultation.expert_specialty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {format(date, "d MMM", { locale: pl })}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {format(date, "HH:mm")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingConsultations;
