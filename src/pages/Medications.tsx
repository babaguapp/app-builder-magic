import { useState } from "react";
import { Plus, Pill, Clock, Check, Trash2, Edit2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMedications, Medication } from "@/hooks/useMedications";
import { Skeleton } from "@/components/ui/skeleton";

const frequencyLabels: Record<string, string> = {
  daily: "Codziennie",
  weekly: "Co tydzień",
  as_needed: "W razie potrzeby",
};

const MedicationForm = ({
  medication,
  onSubmit,
  onClose,
}: {
  medication?: Medication;
  onSubmit: (data: {
    name: string;
    dosage?: string;
    frequency: string;
    times: string[];
    notes?: string;
  }) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(medication?.name || "");
  const [dosage, setDosage] = useState(medication?.dosage || "");
  const [frequency, setFrequency] = useState(medication?.frequency || "daily");
  const [times, setTimes] = useState<string[]>(medication?.times || ["08:00"]);
  const [notes, setNotes] = useState(medication?.notes || "");

  const handleAddTime = () => {
    setTimes([...times, "12:00"]);
  };

  const handleRemoveTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      dosage: dosage || undefined,
      frequency,
      times,
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nazwa leku *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="np. Witamina D3"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dosage">Dawkowanie</Label>
        <Input
          id="dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="np. 1 tabletka, 500mg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Częstotliwość</Label>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Codziennie</SelectItem>
            <SelectItem value="weekly">Co tydzień</SelectItem>
            <SelectItem value="as_needed">W razie potrzeby</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frequency !== "as_needed" && (
        <div className="space-y-2">
          <Label>Godziny przyjmowania</Label>
          <div className="space-y-2">
            {times.map((time, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="flex-1"
                />
                {times.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTime(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTime}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj godzinę
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notatki</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="np. Przyjmować po posiłku"
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Anuluj
        </Button>
        <Button type="submit" className="flex-1">
          {medication ? "Zapisz zmiany" : "Dodaj lek"}
        </Button>
      </div>
    </form>
  );
};

const MedicationCard = ({
  medication,
  onEdit,
  onDelete,
  onTakeMedication,
  isTakenAtTime,
}: {
  medication: Medication;
  onEdit: () => void;
  onDelete: () => void;
  onTakeMedication: (time?: string) => void;
  isTakenAtTime: (time: string) => boolean;
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{medication.name}</h3>
              {medication.dosage && (
                <p className="text-sm text-muted-foreground">{medication.dosage}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {frequencyLabels[medication.frequency] || medication.frequency}
                </Badge>
                {medication.frequency !== "as_needed" && medication.times.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {medication.times.join(", ")}
                  </div>
                )}
              </div>
              {medication.notes && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {medication.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Usunąć lek?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Czy na pewno chcesz usunąć "{medication.name}" z listy leków? Ta akcja jest nieodwracalna.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                    Usuń
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Take medication buttons */}
        {medication.frequency === "as_needed" ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            onClick={() => onTakeMedication()}
          >
            <Check className="h-4 w-4 mr-2" />
            Oznacz jako przyjęty
          </Button>
        ) : (
          medication.times.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {medication.times.map((time) => {
                const taken = isTakenAtTime(time);
                return (
                  <Button
                    key={time}
                    variant={taken ? "default" : "outline"}
                    size="sm"
                    disabled={taken}
                    onClick={() => onTakeMedication(time)}
                    className="flex-1 min-w-[80px]"
                  >
                    {taken ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        {time}
                      </>
                    ) : (
                      time
                    )}
                  </Button>
                );
              })}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

const Medications = () => {
  const {
    medications,
    isLoading,
    addMedication,
    updateMedication,
    deleteMedication,
    logMedicationTaken,
    isMedicationTakenAtTime,
  } = useMedications();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const activeMedications = medications.filter((m) => m.is_active);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="pt-[calc(6rem+env(safe-area-inset-top))] md:pt-24 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-8 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Moje leki</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj lek
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dodaj nowy lek</DialogTitle>
                </DialogHeader>
                <MedicationForm
                  onSubmit={(data) => addMedication.mutate(data)}
                  onClose={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activeMedications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Brak leków</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Dodaj swoje leki, aby śledzić ich przyjmowanie.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj pierwszy lek
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeMedications.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onEdit={() => setEditingMedication(medication)}
                  onDelete={() => deleteMedication.mutate(medication.id)}
                  onTakeMedication={(time) =>
                    logMedicationTaken.mutate({
                      medicationId: medication.id,
                      scheduledTime: time,
                    })
                  }
                  isTakenAtTime={(time) => isMedicationTakenAtTime(medication.id, time)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />

      {/* Edit Dialog */}
      <Dialog open={!!editingMedication} onOpenChange={(open) => !open && setEditingMedication(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj lek</DialogTitle>
          </DialogHeader>
          {editingMedication && (
            <MedicationForm
              medication={editingMedication}
              onSubmit={(data) =>
                updateMedication.mutate({ id: editingMedication.id, ...data })
              }
              onClose={() => setEditingMedication(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Medications;
