import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Info } from "lucide-react";
import { useConsultations } from "@/hooks/useConsultations";
import ConsultationCard from "@/components/booking/ConsultationCard";

const Bookings = () => {
  const navigate = useNavigate();
  const { consultations, loading, refetch } = useConsultations();
  const [activeTab, setActiveTab] = useState("upcoming");

  const now = new Date();

  // Upcoming consultations (scheduled and in the future)
  const upcomingConsultations = consultations.filter(
    (c) => new Date(c.scheduled_at) > now && c.status === "scheduled"
  );

  // Completed consultations (past or marked as completed)
  const completedConsultations = consultations.filter(
    (c) => c.status === "completed" || (new Date(c.scheduled_at) < now && c.status !== "cancelled")
  );

  const handleBookNew = () => {
    navigate("/experts");
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-12 md:py-20 gradient-hero min-h-screen">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Ładowanie wizyt...</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-20 gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
              Moje wizyty
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up animation-delay-100">
              Przeglądaj swoje nadchodzące i odbyte wizyty
            </p>
          </div>

          {/* Book New Button */}
          <div className="max-w-4xl mx-auto mb-8 animate-fade-up animation-delay-200">
            <Button onClick={handleBookNew} size="lg" className="w-full md:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Umów nową wizytę
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto mb-6 animate-fade-up animation-delay-250">
            <div className="flex items-start gap-3 p-4 bg-secondary/50 border border-border rounded-xl">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Informacja o zmianach w rezerwacjach</p>
                <p>
                  Prosimy o wprowadzanie wszelkich zmian w umówionych konsultacjach (zmiana terminu lub odwołanie) 
                  z co najmniej <strong className="text-foreground">24-godzinnym wyprzedzeniem</strong>. 
                  Dzięki temu nasi specjaliści mogą lepiej zaplanować swój czas, a Ty zyskujesz pewność, 
                  że Twoja wizyta odbędzie się bez przeszkód. Dziękujemy za zrozumienie! 💙
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-4xl mx-auto animate-fade-up animation-delay-300">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upcoming" className="text-base">
                  <Calendar className="w-4 h-4 mr-2" />
                  Nadchodzące ({upcomingConsultations.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-base">
                  <Clock className="w-4 h-4 mr-2" />
                  Odbyte ({completedConsultations.length})
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Consultations */}
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingConsultations.length === 0 ? (
                  <Card className="gradient-card shadow-card">
                    <CardContent className="py-12 text-center">
                      <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        Brak nadchodzących wizyt
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Nie masz jeszcze żadnych umówionych wizyt
                      </p>
                      <Button onClick={handleBookNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Umów wizytę
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingConsultations.map((consultation) => (
                    <ConsultationCard
                      key={consultation.id}
                      consultation={consultation}
                      variant="upcoming"
                      onUpdate={refetch}
                    />
                  ))
                )}
              </TabsContent>

              {/* Completed Consultations */}
              <TabsContent value="completed" className="space-y-4">
                {completedConsultations.length === 0 ? (
                  <Card className="gradient-card shadow-card">
                    <CardContent className="py-12 text-center">
                      <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        Brak odbytych wizyt
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Twoja historia wizyt pojawi się tutaj po pierwszej konsultacji
                      </p>
                      <Button onClick={handleBookNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Umów pierwszą wizytę
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  completedConsultations.map((consultation) => (
                    <ConsultationCard
                      key={consultation.id}
                      consultation={consultation}
                      variant="completed"
                      onUpdate={refetch}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bookings;
