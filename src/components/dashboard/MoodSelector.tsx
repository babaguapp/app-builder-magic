import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMoods } from "@/hooks/useMoods";
import { cn } from "@/lib/utils";

const MoodSelector = () => {
  const { todayMood, addMood, getMoodEmoji, getMoodLabel } = useMoods();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions = [1, 2, 3, 4, 5];

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
    setIsExpanded(true);
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);
    await addMood(selectedMood, note);
    setIsSubmitting(false);
    setSelectedMood(null);
    setNote("");
    setIsExpanded(false);
  };

  if (todayMood) {
    return (
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Twój nastrój dziś</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{getMoodEmoji(todayMood.mood_value)}</span>
            <div>
              <p className="font-medium text-foreground">
                {getMoodLabel(todayMood.mood_value)}
              </p>
              {todayMood.note && (
                <p className="text-sm text-muted-foreground mt-1">{todayMood.note}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Jak się dziś czujesz?</CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="flex justify-between gap-1">
          {moodOptions.map((value) => (
            <button
              key={value}
              onClick={() => handleMoodSelect(value)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 min-w-0",
                "hover:bg-accent active:scale-95",
                selectedMood === value && "bg-primary/10 ring-2 ring-primary"
              )}
            >
              <span className="text-2xl sm:text-3xl">{getMoodEmoji(value)}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full text-center">{getMoodLabel(value)}</span>
            </button>
          ))}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <Textarea
              placeholder="Dodaj notatkę (opcjonalnie)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedMood(null);
                  setIsExpanded(false);
                  setNote("");
                }}
                className="flex-1"
              >
                Anuluj
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Zapisuję..." : "Zapisz"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodSelector;
