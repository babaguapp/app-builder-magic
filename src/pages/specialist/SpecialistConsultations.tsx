import { useState } from "react";
import { SpecialistLayout } from "@/components/specialist/SpecialistLayout";
import { useSpecialistConsultations, useUpdateConsultationStatus } from "@/hooks/useSpecialistConsultations";
import { useConsultationRecommendation, useSaveRecommendation } from "@/hooks/useRecommendations";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Video, MapPin, FileText, CheckCircle, Clock, Loader2 } from "lucide-react";

const SpecialistConsultations = () => {
  const { data: allConsultations = [], isLoading } = useSpecialistConsultations();
  const { mutate: updateStatus } = useUpdateConsultationStatus();
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);

  const scheduledConsultations = allConsultations.filter(c => c.status === "scheduled");
  const completedConsultations = allConsultations.filter(c => c.status === "completed");
  const cancelledConsultations = allConsultations.filter(c => c.status === "cancelled");

  const handleComplete = (id: string) => {
    updateStatus({ id, status: "completed" });
  };

  return (
    <SpecialistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Wizyty i zalecenia
          </h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj wizytami i wystawiaj zalecenia
          </p>
        </div>

        <Tabs defaultValue="scheduled">
          <TabsList>
            <TabsTrigger value="scheduled">
              Zaplanowane ({scheduledConsultations.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Zakończone ({completedConsultations.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Anulowane ({cancelledConsultations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scheduled" className="mt-6">
            <ConsultationsList 
              consultations={scheduledConsultations} 
              isLoading={isLoading}
              showComplete
              onComplete={handleComplete}
              onOpenRecommendation={setSelectedConsultation}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <ConsultationsList 
              consultations={completedConsultations} 
              isLoading={isLoading}
              onOpenRecommendation={setSelectedConsultation}
            />
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            <ConsultationsList 
              consultations={cancelledConsultations} 
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>

      <RecommendationDialog 
        consultationId={selectedConsultation}
        onClose={() => setSelectedConsultation(null)}
      />
    </SpecialistLayout>
  );
};

interface ConsultationsListProps {
  consultations: any[];
  isLoading: boolean;
  showComplete?: boolean;
  onComplete?: (id: string) => void;
  onOpenRecommendation?: (id: string) => void;
}

const ConsultationsList = ({ 
  consultations, 
  isLoading, 
  showComplete,
  onComplete,
  onOpenRecommendation
}: ConsultationsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Brak wizyt w tej kategorii</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <Card key={consultation.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg text-foreground">
                    {consultation.patient_name}
                  </p>
                  <Badge variant="secondary">
                    {consultation.consultation_type === "in_person" ? (
                      <><MapPin className="w-3 h-3 mr-1" /> Stacjonarnie</>
                    ) : (
                      <><Video className="w-3 h-3 mr-1" /> Online</>
                    )}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {format(new Date(consultation.scheduled_at), "EEEE, d MMMM yyyy 'o' HH:mm", { locale: pl })}
                </p>
                {consultation.notes && (
                  <p className="text-sm text-muted-foreground">
                    Notatka: {consultation.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onOpenRecommendation && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenRecommendation(consultation.id)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Zalecenia
                  </Button>
                )}
                {showComplete && onComplete && (
                  <Button
                    size="sm"
                    onClick={() => onComplete(consultation.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Zakończ
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface RecommendationDialogProps {
  consultationId: string | null;
  onClose: () => void;
}

const RecommendationDialog = ({ consultationId, onClose }: RecommendationDialogProps) => {
  const { data: recommendation, isLoading } = useConsultationRecommendation(consultationId || "");
  const { mutate: saveRecommendation, isPending } = useSaveRecommendation();
  const [content, setContent] = useState("");

  // Update content when recommendation loads
  useState(() => {
    if (recommendation) {
      setContent(recommendation.content);
    }
  });

  const handleSave = () => {
    if (!consultationId) return;
    saveRecommendation({
      consultationId,
      content,
      existingId: recommendation?.id,
    }, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={!!consultationId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Zalecenia po wizycie</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              value={content || recommendation?.content || ""}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Wpisz zalecenia dla pacjenta..."
              className="min-h-[200px]"
              maxLength={5000}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {(content || recommendation?.content || "").length}/5000 znaków
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>Anuluj</Button>
                <Button onClick={handleSave} disabled={isPending}>
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Zapisz zalecenie
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SpecialistConsultations;
