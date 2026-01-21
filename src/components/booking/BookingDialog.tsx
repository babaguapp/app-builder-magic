import { useState } from "react";
import { format, addDays } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User, Video, Loader2 } from "lucide-react";
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

interface Expert {
  id: number;
  name: string;
  specialty: string;
  rate: number;
}

interface BookingDialogProps {
  expert: Expert;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const BookingDialog = ({ expert, open, onOpenChange, onSuccess }: BookingDialogProps) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"select" | "confirm">("select");

  const handleBooking = async () => {
    if (!user || !selectedDate || !selectedTime) {
      toast.error("Proszę wybrać datę i godzinę");
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
        expert_name: expert.name,
        expert_specialty: expert.specialty,
        scheduled_at: scheduledAt.toISOString(),
        status: "scheduled",
      });

      if (error) throw error;

      toast.success("Wizyta została umówiona!", {
        description: `${expert.name} - ${format(scheduledAt, "d MMMM yyyy, HH:mm", { locale: pl })}`,
      });

      onOpenChange(false);
      setStep("select");
      setSelectedTime(null);
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

  const handleClose = () => {
    onOpenChange(false);
    setStep("select");
    setSelectedTime(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {step === "select" ? "Wybierz termin wizyty" : "Potwierdź rezerwację"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" 
              ? `Rezerwacja wizyty online z ${expert.name}` 
              : "Sprawdź szczegóły i potwierdź wizytę"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <div className="space-y-6 pt-4">
            {/* Expert Info */}
            <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{expert.name}</p>
                <p className="text-sm text-muted-foreground">{expert.specialty}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">${expert.rate}</p>
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
                    {selectedDate ? format(selectedDate, "PPP", { locale: pl }) : "Wybierz datę"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date > addDays(new Date(), 60)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Godzina wizyty</label>
              <div className="grid grid-cols-4 gap-2">
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
            </div>

            {/* Continue Button */}
            <Button
              className="w-full"
              size="lg"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep("confirm")}
            >
              Dalej
            </Button>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {/* Confirmation Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{expert.name}</p>
                  <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Data</span>
                </div>
                <span className="font-medium text-foreground">
                  {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: pl })}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Godzina</span>
                </div>
                <span className="font-medium text-foreground">{selectedTime}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Typ wizyty</span>
                </div>
                <span className="font-medium text-foreground">Wideorozmowa</span>
              </div>

              <div className="flex items-center justify-between p-4 gradient-primary rounded-xl text-primary-foreground">
                <span>Cena</span>
                <span className="font-display font-bold text-xl">${expert.rate}</span>
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
