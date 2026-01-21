import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<boolean>;
  initialRating?: number;
  initialComment?: string;
  isEditing?: boolean;
  onCancel?: () => void;
}

const ReviewForm = ({
  onSubmit,
  initialRating = 0,
  initialComment = "",
  isEditing = false,
  onCancel,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    const success = await onSubmit(rating, comment);
    setIsSubmitting(false);

    if (success && !isEditing) {
      setRating(0);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Twoja ocena
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  (hoveredRating || rating) >= star
                    ? "text-primary fill-primary"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Twoja opinia (opcjonalnie)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Podziel się swoim doświadczeniem z wizyty..."
          rows={4}
          maxLength={1000}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {comment.length}/1000 znaków
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="flex-1"
        >
          {isSubmitting
            ? "Zapisywanie..."
            : isEditing
            ? "Zaktualizuj opinię"
            : "Dodaj opinię"}
        </Button>
        {isEditing && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
