import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Users, Calendar } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float animation-delay-200" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full animate-fade-up">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Trusted by 10,000+ users worldwide
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-up animation-delay-100">
              Connect with{" "}
              <span className="text-transparent bg-clip-text gradient-primary">
                World-Class
              </span>{" "}
              Experts
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-up animation-delay-200">
              Get personalized advice from industry leaders. Book video
              consultations, access exclusive insights, and transform your
              knowledge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
              <Link to="/bookings">
                <Button size="xl" variant="hero">
                  Book a Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/posts">
                <Button size="xl" variant="outline">
                  <Play className="w-5 h-5" />
                  Explore Content
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4 animate-fade-up animation-delay-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-foreground">
                    500+
                  </p>
                  <p className="text-sm text-muted-foreground">Experts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-foreground">
                    25K+
                  </p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary fill-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-foreground">
                    4.9
                  </p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Expert Cards */}
          <div className="relative lg:h-[600px] hidden lg:block">
            <div className="absolute top-0 right-0 w-64 h-80 gradient-card rounded-2xl shadow-card p-6 animate-fade-up animation-delay-100 hover:shadow-hover transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 mb-4" />
              <h3 className="font-display font-semibold text-lg text-foreground">
                Dr. Sarah Chen
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Health & Wellness
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-primary fill-primary"
                  />
                ))}
              </div>
              <Button size="sm" variant="soft" className="w-full">
                Book Now
              </Button>
            </div>

            <div className="absolute top-32 left-0 w-56 h-72 gradient-card rounded-2xl shadow-card p-5 animate-fade-up animation-delay-200 hover:shadow-hover transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary/30 mb-3" />
              <h3 className="font-display font-semibold text-foreground">
                Marcus Reid
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Business Strategy
              </p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 text-primary fill-primary"
                  />
                ))}
              </div>
              <Button size="sm" variant="soft" className="w-full">
                Book Now
              </Button>
            </div>

            <div className="absolute bottom-0 right-8 w-60 h-64 gradient-card rounded-2xl shadow-card p-5 animate-fade-up animation-delay-300 hover:shadow-hover transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-accent mb-3" />
              <h3 className="font-display font-semibold text-foreground">
                Emily Torres
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Tech & Innovation
              </p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 text-primary fill-primary"
                  />
                ))}
              </div>
              <Button size="sm" variant="soft" className="w-full">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
