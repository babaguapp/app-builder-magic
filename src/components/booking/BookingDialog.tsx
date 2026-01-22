import { useState } from "react";
import { format, addDays } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  Building2,
  Loader2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Expert } from "@/hooks/useExperts";

interface BookingDialogProps {
  expert: Expert;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Default time slots - in production these would come from expert.available_slots_*
const defaultOnlineSlots = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
];

const defaultInPersonSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
];

type ConsultationType = "online" | "in_person";

const BookingDialog = ({
  expert,
  open,
  onOpenChange,
  onSuccess,
}: BookingDialogProps) => {
  const { user } = useAuth();
  const [consultationType, setConsultationType] =
    useState<ConsultationType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    addDays(new Date(), 1)
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"type" | "select" | "confirm">("type");

  // Get available time slots based on consultation type
  const getTimeSlots = () => {
    if (consultationType === "online") {
      // In production: parse expert.available_slots_online
      return defaultOnlineSlots;
    } else if (consultationType === "in_person") {
      // In production: parse expert.available_slots_in_person
      return defaultInPersonSlots;
    }
    return [];
  };

  // Get rate based on consultation type
  const getRate = () => {
    if (consultationType === "online") {
      return expert.rate_online;
    } else if (consultationType === "in_person") {
      return expert.rate_in_person;
    }
    return null;
  };

  const handleBooking = async () => {
    if (!user || !selectedDate || !selectedTime || !consultationType) {
      toast.error("Proszę wybrać typ wizyty, datę i godzinę");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the scheduled_at datetime
      const [hours, minutes] = selectedTime.split(":");
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase.from("user_consultations").insert({
        user_id: user.id,
        expert_id: expert.id,
        expert_name: expert.name,
        expert_specialty: expert.specialty,
        scheduled_at: scheduledAt.toISOString(),
        status: "scheduled",
        consultation_type: consultationType,
      });

      if (error) throw error;

      const typeLabel =
        consultationType === "online" ? "online" : "stacjonarna";
      toast.success(`Wizyta ${typeLabel} została umówiona!`, {
        description: `${expert.name} - ${format(scheduledAt, "d MMMM yyyy, HH:mm", { locale: pl })}`,
      });

      onOpenChange(false);
      resetDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Error booking consultation:", error);
      toast.error("Nie udało się umówić wizyty", {
        description: "Spróbuj ponownie później",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDialog = () => {
    setStep("type");
    setConsultationType(null);
    setSelectedTime(null);
    setSelectedDate(addDays(new Date(), 1));
  };

  const handleClose = () => {
    onOpenChange(false);
    resetDialog();
  };

  const handleTypeSelect = (type: ConsultationType) => {
    setConsultationType(type);
    setSelectedTime(null); // Reset time when changing type
    setStep("select");
  };

  const rate = getRate();
  const timeSlots = getTimeSlots();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {step === "type" && "Wybierz typ wizyty"}
            {step === "select" && "Wybierz termin wizyty"}
            {step === "confirm" && "Potwierdź rezerwację"}
          </DialogTitle>
          <DialogDescription>
            {step === "type" && `Rezerwacja wizyty z ${expert.name}`}
            {step === "select" &&
              `${consultationType === "online" ? "Wizyta online" : "Wizyta stacjonarna"} z ${expert.name}`}
            {step === "confirm" && "Sprawdź szczegóły i potwierdź wizytę"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Select Consultation Type */}
        {step === "type" && (
          <div className="space-y-6 pt-4">
            {/* Expert Info */}
            <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{expert.name}</p>
                <p className="text-sm text-muted-foreground">
                  {expert.specialty}
                </p>
              </div>
            </div>

            {/* Consultation Type Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Jak chcesz się spotkać?
              </label>

              {expert.offers_online && (
                <button
                  onClick={() => handleTypeSelect("online")}
                  className="w-full p-4 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        Wizyta online
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Wideo rozmowa przez platformę
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-foreground">
                        {expert.rate_online} zł
                      </p>
                    </div>
                  </div>
                </button>
              )}

              {expert.offers_in_person && (
                <button
                  onClick={() => handleTypeSelect("in_person")}
                  className="w-full p-4 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        Wizyta stacjonarna
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {expert.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-foreground">
                        {expert.rate_in_person} zł
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Date and Time */}
        {step === "select" && (
          <div className="space-y-6 pt-4">
            {/* Selected Type Info */}
            <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                {consultationType === "online" ? (
                  <Video className="w-6 h-6 text-primary" />
                ) : (
                  <Building2 className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{expert.name}</p>
                <p className="text-sm text-muted-foreground">
                  {consultationType === "online"
                    ? "Wizyta online"
                    : `Wizyta stacjonarna • ${expert.city}`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{rate} zł</p>
                <p className="text-xs text-muted-foreground">za sesję</p>
              </div>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data wizyty</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, "PPP", { locale: pl })
                      : "Wybierz datę"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date() || date > addDays(new Date(), 60)
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Godzina wizyty</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="text-sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
              {timeSlots.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Brak dostępnych terminów
                </p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("type")}
                className="flex-1"
              >
                Wstecz
              </Button>
              <Button
                className="flex-1"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep("confirm")}
              >
                Dalej
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && (
          <div className="space-y-6 pt-4">
            {/* Confirmation Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{expert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {expert.specialty}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Data</span>
                </div>
                <span className="font-medium text-foreground">
                  {selectedDate &&
                    format(selectedDate, "d MMMM yyyy", { locale: pl })}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Godzina</span>
                </div>
                <span className="font-medium text-foreground">
                  {selectedTime}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-2">
                  {consultationType === "online" ? (
                    <Video className="w-4 h-4 text-primary" />
                  ) : (
                    <Building2 className="w-4 h-4 text-primary" />
                  )}
                  <span className="text-muted-foreground">Typ wizyty</span>
                </div>
                <span className="font-medium text-foreground">
                  {consultationType === "online"
                    ? "Online (wideo)"
                    : "Stacjonarnie"}
                </span>
              </div>

              {consultationType === "in_person" && (
                <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Lokalizacja</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {expert.city}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-4 gradient-primary rounded-xl text-primary-foreground">
                <span>Cena</span>
                <span className="font-display font-bold text-xl">
                  {rate} zł
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("select")}
                disabled={isSubmitting}
              >
                Wstecz
              </Button>
              <Button
                className="flex-1"
                onClick={handleBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rezerwacja...
                  </>
                ) : (
                  "Potwierdź rezerwację"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
