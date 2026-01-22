import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import BookingDialog from "@/components/booking/BookingDialog";
import ExpertFilters from "@/components/experts/ExpertFilters";
import ExpertCard from "@/components/experts/ExpertCard";
import {
  useExperts,
  useExpertCities,
  useExpertCategories,
  Expert,
  ExpertFilters as FiltersType,
} from "@/hooks/useExperts";
import { Skeleton } from "@/components/ui/skeleton";

const Experts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersType>({
    search: "",
    category: "All",
    city: "all",
    consultationType: "all",
    gender: "all",
  });
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  const { data: experts, isLoading: expertsLoading } = useExperts(filters);
  const { data: cities = [] } = useExpertCities();
  const { data: categories = [] } = useExpertCategories();

  const handleBookClick = (e: React.MouseEvent, expert: Expert) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    setSelectedExpert(expert);
    setBookingDialogOpen(true);
  };

  const handleBookingSuccess = () => {
    navigate("/bookings");
  };

  return (
    <Layout>
      <section className="py-12 md:py-20 gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
              Znajdź specjalistę
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up animation-delay-100">
              Przeglądaj naszą sieć zweryfikowanych ekspertów
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-6xl mx-auto mb-12 animate-fade-up animation-delay-200">
            <ExpertFilters
              filters={filters}
              onFiltersChange={setFilters}
              cities={cities}
              categories={categories}
            />
          </div>

          {/* Loading State */}
          {expertsLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="gradient-card rounded-2xl p-6">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-5 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Experts Grid */}
          {!expertsLoading && experts && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert, index) => (
                <div
                  key={expert.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ExpertCard expert={expert} onBookClick={handleBookClick} />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!expertsLoading && experts?.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                Nie znaleziono specjalistów spełniających kryteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Dialog */}
      {selectedExpert && (
        <BookingDialog
          expert={selectedExpert}
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          onSuccess={handleBookingSuccess}
        />
      )}
    </Layout>
  );
};

export default Experts;
