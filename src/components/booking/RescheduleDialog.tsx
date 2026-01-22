import { useState } from "react";
import { format, addDays } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
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
import { toast } from "sonner";

interface RescheduleDialogProps {
  consultationId: string;
  expertName: string;
  currentDate: Date;
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

const RescheduleDialog = ({
  consultationId,
  expertName,
  currentDate,
  open,
  onOpenChange,
  onSuccess,
}: RescheduleDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Proszę wybrać nową datę i godzinę");
      return;
    }

    setIsSubmitting(true);

    try {
      const [hours, minutes] = selectedTime.split(":");
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase
        .from("user_consultations")
        .update({ scheduled_at: scheduledAt.toISOString() })
        .eq("id", consultationId);

      if (error) throw error;

      toast.success("Termin został zmieniony!", {
        description: `Nowy termin: ${format(scheduledAt, "d MMMM yyyy, HH:mm", { locale: pl })}`,
      });

      onOpenChange(false);
      setSelectedTime(null);
      onSuccess?.();
    } catch (error) {
      console.error("Error rescheduling consultation:", error);
      toast.error("Nie udało się zmienić terminu", {
        description: "Spróbuj ponownie później",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedTime(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Zmień termin wizyty</DialogTitle>
          <DialogDescription>
            Wybierz nowy termin konsultacji z {expertName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Current Date Info */}
          <div className="p-4 bg-secondary rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Obecny termin:</p>
            <p className="font-medium text-foreground">
              {format(currentDate, "d MMMM yyyy, HH:mm", { locale: pl })}
            </p>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nowa data wizyty</label>
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
            <label className="text-sm font-medium">Nowa godzina wizyty</label>
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
            <Button
              className="flex-1"
              onClick={handleReschedule}
              disabled={!selectedDate || !selectedTime || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                "Zmień termin"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
