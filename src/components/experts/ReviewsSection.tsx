import { useState } from "react";
import { Star, MessageSquare, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface ReviewsSectionProps {
  expertId: number;
  expertName: string;
}

const ReviewsSection = ({ expertId, expertName }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const {
    reviews,
    loading,
    userReview,
    canReview,
    completedConsultations,
    averageRating,
    reviewCount,
    addReview,
    updateReview,
    deleteReview,
  } = useReviews(expertId);
  
  const [showForm, setShowForm] = useState(false);

  const handleAddReview = async (rating: number, comment: string) => {
    // Find first consultation without a review
    const unreviewedConsultation = completedConsultations.find((c) => !c.hasReview);
    const success = await addReview(rating, comment, unreviewedConsultation?.id);
    if (success) setShowForm(false);
    return success;
  };

  if (loading) {
    return (
      <div className="gradient-card rounded-2xl shadow-card p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-card rounded-2xl shadow-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Opinie pacjentów
            </h2>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-medium text-foreground">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span>•</span>
              <span>{reviewCount} {reviewCount === 1 ? "opinia" : reviewCount < 5 ? "opinie" : "opinii"}</span>
            </div>
          )}
        </div>

        {user && canReview && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            Dodaj opinię
          </Button>
        )}
      </div>

      {/* Info about review eligibility */}
      {user && !canReview && !userReview && (
        <Alert className="mb-6">
          <CalendarCheck className="h-4 w-4" />
          <AlertDescription>
            Aby wystawić opinię, musisz najpierw odbyć wizytę z tym specjalistą.{" "}
            <Link to={`/bookings?expert=${expertId}`} className="text-primary hover:underline font-medium">
              Umów wizytę
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Add Review Form */}
      {showForm && canReview && (
        <div className="mb-6 p-4 bg-muted/50 rounded-xl">
          <h3 className="font-medium text-foreground mb-3">
            Wystaw opinię dla {expertName}
          </h3>
          <ReviewForm
            onSubmit={handleAddReview}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwn={user?.id === review.user_id}
              onUpdate={updateReview}
              onDelete={deleteReview}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">
            Brak opinii dla tego specjalisty
          </p>
          {user && canReview && !showForm && (
            <Button variant="soft" size="sm" onClick={() => setShowForm(true)}>
              Bądź pierwszy i wystaw opinię
            </Button>
          )}
          {user && !canReview && !userReview && (
            <p className="text-sm text-muted-foreground">
              Opinie mogą wystawiać tylko pacjenci po odbytej wizycie
            </p>
          )}
          {!user && (
            <p className="text-sm text-muted-foreground">
              Zaloguj się, aby zobaczyć więcej
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
