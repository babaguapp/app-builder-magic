import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar, Clock, User, Video, Star, CalendarClock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RescheduleDialog from "./RescheduleDialog";
import CancelBookingDialog from "./CancelBookingDialog";
import type { Consultation } from "@/hooks/useConsultations";

interface ConsultationCardProps {
  consultation: Consultation;
  variant: "upcoming" | "completed";
  onUpdate?: () => void;
}

// Helper function to get expert ID from name (simplified - in production you'd have expert_id in DB)
const getExpertIdFromName = (name: string): number => {
  if (name.toLowerCase().includes("chen")) return 1;
  if (name.toLowerCase().includes("kowalski")) return 2;
  if (name.toLowerCase().includes("nowak")) return 3;
  if (name.toLowerCase().includes("wiśniewska")) return 4;
  return 1;
};

const ConsultationCard = ({ consultation, variant, onUpdate }: ConsultationCardProps) => {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const date = new Date(consultation.scheduled_at);
  const expertId = getExpertIdFromName(consultation.expert_name);
  const isUpcoming = variant === "upcoming";

  return (
    <>
      <Card className="gradient-card shadow-card hover:shadow-hover transition-all">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Top Row - Expert Info & Date */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Expert Info with Link */}
              <Link
                to={`/experts/${expertId}`}
                className="flex items-center gap-4 flex-1 group"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                  isUpcoming 
                    ? "bg-gradient-to-br from-primary/20 to-accent" 
                    : "bg-gradient-to-br from-muted to-accent/50"
                }`}>
                  <User className={`w-7 h-7 ${isUpcoming ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {consultation.expert_name}
                  </h3>
                  <p className="text-muted-foreground">
                    {consultation.expert_specialty}
                  </p>
                </div>
              </Link>

              {/* Date & Time */}
              <div className="flex items-center gap-4 md:gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${isUpcoming ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={isUpcoming ? "font-medium" : "text-muted-foreground"}>
                    {format(date, "d MMMM yyyy", { locale: pl })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${isUpcoming ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={isUpcoming ? "font-medium" : "text-muted-foreground"}>
                    {format(date, "HH:mm")}
                  </span>
                </div>
                {isUpcoming && (
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Wideorozmowa</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {consultation.notes && (
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Notatki:</span> {consultation.notes}
                </p>
              </div>
            )}

            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
              {isUpcoming ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setRescheduleOpen(true)}
                  >
                    <CalendarClock className="w-4 h-4" />
                    Zmień termin
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setCancelOpen(true)}
                  >
                    <X className="w-4 h-4" />
                    Odwołaj wizytę
                  </Button>
                </>
              ) : (
                <Link to={`/experts/${expertId}#reviews`}>
                  <Button variant="default" size="sm" className="gap-2">
                    <Star className="w-4 h-4" />
                    Wystaw opinię
                  </Button>
                </Link>
              )}

              {/* Profile Link */}
              <Link to={`/experts/${expertId}`} className="ml-auto">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  Zobacz profil
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <RescheduleDialog
        consultationId={consultation.id}
        expertName={consultation.expert_name}
        currentDate={date}
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onSuccess={onUpdate}
      />

      <CancelBookingDialog
        consultationId={consultation.id}
        expertName={consultation.expert_name}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onSuccess={onUpdate}
      />
    </>
  );
};

export default ConsultationCard;
