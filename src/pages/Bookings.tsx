import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Star, Video, Plus } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useConsultations } from "@/hooks/useConsultations";

const Bookings = () => {
  const navigate = useNavigate();
  const { consultations, loading } = useConsultations();
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
                  upcomingConsultations.map((consultation) => {
                    const date = new Date(consultation.scheduled_at);
                    return (
                      <Card key={consultation.id} className="gradient-card shadow-card hover:shadow-hover transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Expert Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                                <User className="w-7 h-7 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-foreground">
                                  {consultation.expert_name}
                                </h3>
                                <p className="text-muted-foreground">
                                  {consultation.expert_specialty}
                                </p>
                              </div>
                            </div>

                            {/* Date & Time */}
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="font-medium">
                                  {format(date, "d MMMM yyyy", { locale: pl })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="font-medium">
                                  {format(date, "HH:mm")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Wideorozmowa</span>
                              </div>
                            </div>
                          </div>

                          {consultation.notes && (
                            <div className="mt-4 p-3 bg-secondary rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Notatki:</span> {consultation.notes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
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
                  completedConsultations.map((consultation) => {
                    const date = new Date(consultation.scheduled_at);
                    // Extract expert ID from name for review link (simplified - in production you'd have expert_id)
                    const expertId = consultation.expert_name.toLowerCase().includes("chen") ? 1 :
                                    consultation.expert_name.toLowerCase().includes("kowalski") ? 2 :
                                    consultation.expert_name.toLowerCase().includes("nowak") ? 3 : 1;
                    
                    return (
                      <Card key={consultation.id} className="gradient-card shadow-card hover:shadow-hover transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Expert Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-muted to-accent/50 flex items-center justify-center">
                                <User className="w-7 h-7 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-foreground">
                                  {consultation.expert_name}
                                </h3>
                                <p className="text-muted-foreground">
                                  {consultation.expert_specialty}
                                </p>
                              </div>
                            </div>

                            {/* Date & Time */}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {format(date, "d MMMM yyyy", { locale: pl })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {format(date, "HH:mm")}
                                </span>
                              </div>
                            </div>

                            {/* Review CTA */}
                            <Link to={`/experts/${expertId}#reviews`}>
                              <Button variant="default" size="sm" className="gap-2">
                                <Star className="w-4 h-4" />
                                Wystaw opinię
                              </Button>
                            </Link>
                          </div>

                          {consultation.notes && (
                            <div className="mt-4 p-3 bg-secondary rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Notatki:</span> {consultation.notes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
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
