import { SpecialistLayout } from "@/components/specialist/SpecialistLayout";
import { useSpecialistConsultations } from "@/hooks/useSpecialistConsultations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from "date-fns";
import { pl } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Video, MapPin } from "lucide-react";

const SpecialistCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const { data: consultations = [], isLoading } = useSpecialistConsultations("scheduled");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getConsultationsForDay = (day: Date) => {
    return consultations.filter(c => isSameDay(new Date(c.scheduled_at), day));
  };

  const selectedDayConsultations = selectedDate 
    ? getConsultationsForDay(selectedDate)
    : [];

  const weekDays = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nie"];

  return (
    <SpecialistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Kalendarz wizyt
          </h1>
          <p className="text-muted-foreground mt-1">
            Przegląd zaplanowanych konsultacji
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {format(currentMonth, "LLLL yyyy", { locale: pl })}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day) => {
                    const dayConsultations = getConsultationsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          aspect-square p-1 rounded-lg transition-colors relative
                          ${isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"}
                          ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
                          ${isToday && !isSelected ? "ring-2 ring-primary" : ""}
                        `}
                      >
                        <span className="text-sm">{format(day, "d")}</span>
                        {dayConsultations.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            {dayConsultations.slice(0, 3).map((_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSelected ? "bg-primary-foreground" : "bg-primary"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                {selectedDate
                  ? format(selectedDate, "d MMMM yyyy", { locale: pl })
                  : "Wybierz dzień"}
              </h3>

              {selectedDayConsultations.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Brak wizyt w tym dniu
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDayConsultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="p-3 bg-accent/50 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground text-sm">
                          {format(new Date(consultation.scheduled_at), "HH:mm")}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {consultation.consultation_type === "in_person" ? (
                            <><MapPin className="w-3 h-3 mr-1" /> Stacj.</>
                          ) : (
                            <><Video className="w-3 h-3 mr-1" /> Online</>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">
                        {consultation.patient_name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SpecialistLayout>
  );
};

export default SpecialistCalendar;
