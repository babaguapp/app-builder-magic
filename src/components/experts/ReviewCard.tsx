import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Star, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReviewForm from "./ReviewForm";
import { Review } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  isOwn?: boolean;
  onUpdate?: (reviewId: string, rating: number, comment: string) => Promise<boolean>;
  onDelete?: (reviewId: string) => Promise<boolean>;
}

const ReviewCard = ({ review, isOwn, onUpdate, onDelete }: ReviewCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUpdate = async (rating: number, comment: string) => {
    if (!onUpdate) return false;
    const success = await onUpdate(review.id, rating, comment);
    if (success) setIsEditing(false);
    return success;
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    await onDelete(review.id);
    setShowDeleteDialog(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-muted/50 rounded-xl">
        <ReviewForm
          onSubmit={handleUpdate}
          initialRating={review.rating}
          initialComment={review.comment || ""}
          isEditing
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-muted/30 rounded-xl">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(review.user_name || "U")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {review.user_name}
                </span>
                {isOwn && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Twoja opinia
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.created_at), "d MMM yyyy", { locale: pl })}
                </span>
                
                {isOwn && onUpdate && onDelete && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edytuj
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    review.rating >= star
                      ? "text-primary fill-primary"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń opinię</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć swoją opinię? Tej akcji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewCard;
