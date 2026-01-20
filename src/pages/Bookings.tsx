import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Star, Video, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays } from "date-fns";

const experts = [
  { id: 1, name: "Dr. Sarah Chen", specialty: "Health & Wellness", rate: 150 },
  { id: 2, name: "Marcus Reid", specialty: "Business Strategy", rate: 200 },
  { id: 3, name: "Emily Torres", specialty: "Tech & Innovation", rate: 175 },
  { id: 4, name: "Dr. James Okonkwo", specialty: "Mental Health", rate: 180 },
  { id: 5, name: "Lisa Wang", specialty: "Financial Planning", rate: 165 },
  { id: 6, name: "Alex Rivera", specialty: "Career Coaching", rate: 120 },
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const Bookings = () => {
  const [searchParams] = useSearchParams();
  const expertId = searchParams.get("expert");

  const [selectedExpert, setSelectedExpert] = useState<number | null>(
    expertId ? parseInt(expertId) : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    addDays(new Date(), 1)
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const currentExpert = experts.find((e) => e.id === selectedExpert);

  const handleBooking = () => {
    // This would integrate with the backend
    alert(
      `Booking confirmed!\n\nExpert: ${currentExpert?.name}\nDate: ${
        selectedDate ? format(selectedDate, "PPP") : ""
      }\nTime: ${selectedTime}`
    );
  };

  return (
    <Layout>
      <section className="py-12 md:py-20 gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
              Book a Consultation
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up animation-delay-100">
              Schedule a video session with your chosen expert
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-xl mx-auto mb-12 animate-fade-up animation-delay-200">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-display font-bold transition-all",
                      step >= s
                        ? "gradient-primary text-primary-foreground shadow-soft"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        "w-24 md:w-32 h-1 mx-2 rounded-full transition-all",
                        step > s ? "bg-primary" : "bg-secondary"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Select Expert</span>
              <span>Choose Time</span>
              <span>Confirm</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Select Expert */}
            {step === 1 && (
              <div className="animate-fade-up">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Choose your expert
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {experts.map((expert) => (
                    <button
                      key={expert.id}
                      onClick={() => setSelectedExpert(expert.id)}
                      className={cn(
                        "p-4 rounded-xl text-left transition-all duration-200",
                        selectedExpert === expert.id
                          ? "gradient-primary text-primary-foreground shadow-soft"
                          : "gradient-card shadow-card hover:shadow-hover"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full",
                            selectedExpert === expert.id
                              ? "bg-primary-foreground/20"
                              : "bg-gradient-to-br from-primary/20 to-accent"
                          )}
                        />
                        <div>
                          <h3 className="font-semibold">{expert.name}</h3>
                          <p
                            className={cn(
                              "text-sm",
                              selectedExpert === expert.id
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            )}
                          >
                            {expert.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star
                            className={cn(
                              "w-4 h-4",
                              selectedExpert === expert.id
                                ? "text-primary-foreground fill-primary-foreground"
                                : "text-primary fill-primary"
                            )}
                          />
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                        <span className="font-semibold">${expert.rate}/hr</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-8">
                  <Button
                    size="lg"
                    onClick={() => setStep(2)}
                    disabled={!selectedExpert}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {step === 2 && (
              <div className="animate-fade-up">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div className="gradient-card rounded-2xl shadow-card p-6">
                    <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                      Select a date
                    </h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md pointer-events-auto"
                    />
                  </div>

                  {/* Time Slots */}
                  <div className="gradient-card rounded-2xl shadow-card p-6">
                    <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                      Available times
                    </h3>
                    {selectedDate ? (
                      <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "p-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
                              selectedTime === time
                                ? "gradient-primary text-primary-foreground shadow-soft"
                                : "bg-secondary hover:bg-accent text-foreground"
                            )}
                          >
                            <Clock className="w-4 h-4" />
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Please select a date first
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setStep(3)}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && currentExpert && (
              <div className="animate-fade-up">
                <div className="max-w-lg mx-auto gradient-card rounded-2xl shadow-card p-8">
                  <h3 className="font-display font-semibold text-xl text-foreground mb-6 text-center">
                    Confirm your booking
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {currentExpert.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {currentExpert.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium text-foreground">
                        {selectedDate ? format(selectedDate, "PPP") : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium text-foreground">
                        {selectedTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                      <span className="text-muted-foreground">Session type</span>
                      <span className="font-medium text-foreground flex items-center gap-2">
                        <Video className="w-4 h-4 text-primary" />
                        Video call
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 gradient-primary rounded-xl text-primary-foreground">
                      <span>Total</span>
                      <span className="font-display font-bold text-xl">
                        ${currentExpert.rate}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => setStep(2)}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </Button>
                    <Button size="lg" className="flex-1" onClick={handleBooking}>
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bookings;
