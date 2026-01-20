import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Video, ArrowRight } from "lucide-react";

const experts = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Health & Wellness",
    rating: 4.9,
    sessions: 342,
    rate: 150,
    bio: "Board-certified physician with 15+ years in integrative medicine.",
    available: true,
  },
  {
    id: 2,
    name: "Marcus Reid",
    specialty: "Business Strategy",
    rating: 4.8,
    sessions: 521,
    rate: 200,
    bio: "Former Fortune 500 executive, startup advisor and mentor.",
    available: true,
  },
  {
    id: 3,
    name: "Emily Torres",
    specialty: "Tech & Innovation",
    rating: 5.0,
    sessions: 189,
    rate: 175,
    bio: "AI researcher and tech entrepreneur with 3 successful exits.",
    available: false,
  },
  {
    id: 4,
    name: "Dr. James Okonkwo",
    specialty: "Mental Health",
    rating: 4.9,
    sessions: 456,
    rate: 180,
    bio: "Licensed psychologist specializing in cognitive behavioral therapy.",
    available: true,
  },
];

const FeaturedExperts = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-up">
            Featured Experts
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-up animation-delay-100">
            Connect with top-rated professionals across various fields for
            personalized video consultations.
          </p>
        </div>

        {/* Experts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((expert, index) => (
            <div
              key={expert.id}
              className={`group gradient-card rounded-2xl shadow-card p-6 hover:shadow-hover transition-all duration-300 animate-fade-up animation-delay-${
                (index + 1) * 100
              }`}
            >
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent" />
                {expert.available && (
                  <div className="absolute bottom-0 right-1/2 translate-x-8 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>

              {/* Info */}
              <div className="text-center mb-4">
                <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {expert.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {expert.specialty}
                </p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {expert.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({expert.sessions} sessions)
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-2">
                {expert.bio}
              </p>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <span className="font-display font-bold text-lg text-foreground">
                    ${expert.rate}
                  </span>
                  <span className="text-sm text-muted-foreground">/session</span>
                </div>
                <Link to={`/bookings?expert=${expert.id}`}>
                  <Button size="sm" variant="soft">
                    <Video className="w-4 h-4" />
                    Book
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link to="/experts">
            <Button variant="outline" size="lg">
              View All Experts
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperts;
