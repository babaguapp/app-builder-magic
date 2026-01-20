import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-float animation-delay-200" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 rounded-full mb-6 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              Start your journey today
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 animate-fade-up animation-delay-100">
            Ready to Transform Your Knowledge?
          </h2>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 animate-fade-up animation-delay-200">
            Join thousands of professionals who are accelerating their growth
            with expert guidance. Your first consultation is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-300">
            <Link to="/auth?mode=signup">
              <Button
                size="xl"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/experts">
              <Button
                size="xl"
                variant="outline"
                className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
              >
                Browse Experts
              </Button>
            </Link>
          </div>

          <p className="text-sm text-primary-foreground/60 mt-6 animate-fade-up animation-delay-400">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
