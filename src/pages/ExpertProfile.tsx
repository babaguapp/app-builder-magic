import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewsSection from "@/components/experts/ReviewsSection";
import BookingDialog from "@/components/booking/BookingDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useExpert } from "@/hooks/useExperts";
import {
  Star,
  Video,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Award,
  ArrowLeft,
  MessageCircle,
  Building2,
} from "lucide-react";

const ExpertProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const { data: expert, isLoading, error } = useExpert(id);

  if (isLoading) {
    return (
      <Layout>
        <section className="py-6 md:py-12 gradient-hero min-h-screen">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-24 mb-6" />
            <div className="gradient-card rounded-2xl p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
                <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !expert) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Nie znaleziono specjalisty
            </h1>
            <p className="text-muted-foreground mb-4">
              Przepraszamy, nie mogliśmy znaleźć tego profilu.
            </p>
            <Link to="/experts">
              <Button>Wróć do listy specjalistów</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBookClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setBookingDialogOpen(true);
  };

  const handleBookingSuccess = () => {
    navigate("/bookings");
  };

  const isAvailable = expert.offers_online || expert.offers_in_person;
  const minRate = Math.min(
    expert.rate_online || Infinity,
    expert.rate_in_person || Infinity
  );
  const displayRate = minRate === Infinity ? null : minRate;

  return (
    <Layout>
      <section className="py-6 md:py-12 gradient-hero min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Wróć</span>
          </button>

          {/* Main Profile Card */}
          <div className="gradient-card rounded-2xl shadow-card p-6 md:p-8 mb-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-primary/20">
                  <AvatarImage
                    src={expert.avatar_url || undefined}
                    alt={expert.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent text-2xl md:text-3xl font-semibold text-primary">
                    {getInitials(expert.name)}
                  </AvatarFallback>
                </Avatar>
                {isAvailable && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-card" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {expert.name}
                  </h1>
                  {isAvailable ? (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    >
                      Dostępny
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-muted text-muted-foreground"
                    >
                      Niedostępny
                    </Badge>
                  )}
                </div>

                <p className="text-lg text-primary font-medium mb-3">
                  {expert.specialty}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="font-semibold text-foreground">
                      {expert.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    <span>{expert.sessions_count} sesji</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{expert.city}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-3">
                <div className="text-center md:text-right">
                  {displayRate ? (
                    <>
                      <span className="text-sm text-muted-foreground">
                        od{" "}
                      </span>
                      <span className="font-display text-3xl font-bold text-foreground">
                        {displayRate} zł
                      </span>
                      <span className="text-muted-foreground">/sesja</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      Cena do ustalenia
                    </span>
                  )}
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!isAvailable}
                  onClick={handleBookClick}
                >
                  <Calendar className="w-5 h-5" />
                  Umów wizytę
                </Button>
              </div>
            </div>

            {/* Consultation Types */}
            <div className="flex flex-wrap gap-3 mb-6">
              {expert.offers_online && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl">
                  <Video className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    Online: {expert.rate_online} zł
                  </span>
                </div>
              )}
              {expert.offers_in_person && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    Stacjonarnie: {expert.rate_in_person} zł
                  </span>
                </div>
              )}
            </div>

            {/* Quick Info */}
            {isAvailable && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  <span className="text-muted-foreground">
                    Dostępne terminy:{" "}
                  </span>
                  <span className="font-medium text-foreground">
                    Sprawdź w kalendarzu
                  </span>
                </span>
              </div>
            )}

            {/* Bio */}
            <div className="mb-8">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                O mnie
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {expert.bio}
              </p>
            </div>

            {/* Languages */}
            {expert.languages && expert.languages.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                  Języki
                </h2>
                <div className="flex flex-wrap gap-2">
                  {expert.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Education & Certifications */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Education */}
            {expert.education && expert.education.length > 0 && (
              <div className="gradient-card rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Wykształcenie
                  </h2>
                </div>
                <ul className="space-y-3">
                  {expert.education.map((edu, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {edu}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {expert.certifications && expert.certifications.length > 0 && (
              <div className="gradient-card rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Certyfikaty
                  </h2>
                </div>
                <ul className="space-y-3">
                  {expert.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {cert}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reviews Section - using expert.id which is now a string UUID */}
          <ReviewsSection
            expertId={parseInt(expert.id.slice(0, 8), 16) % 1000000}
            expertName={expert.name}
          />

          {/* CTA Card */}
          <div className="gradient-card rounded-2xl shadow-card p-6 text-center mt-6">
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Gotowy na konsultację?
            </h3>
            <p className="text-muted-foreground mb-4">
              Umów się na wizytę z {expert.name.split(" ")[0]}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                disabled={!isAvailable}
                onClick={handleBookClick}
              >
                <Calendar className="w-5 h-5" />
                Umów wizytę
              </Button>
              <Button size="lg" variant="outline" disabled={!isAvailable}>
                <MessageCircle className="w-5 h-5" />
                Wyślij wiadomość
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      {expert && (
        <BookingDialog
          expert={expert}
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          onSuccess={handleBookingSuccess}
        />
      )}
    </Layout>
  );
};

export default ExpertProfile;
