import { Search, Calendar, Video, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Expert",
    description:
      "Browse our curated network of verified professionals across multiple fields.",
  },
  {
    icon: Calendar,
    title: "Book a Time",
    description:
      "Choose a convenient slot from your expert's real-time availability calendar.",
  },
  {
    icon: Video,
    title: "Join the Session",
    description:
      "Connect via secure video call for your personalized consultation.",
  },
  {
    icon: Star,
    title: "Get Results",
    description:
      "Receive actionable insights, follow-up resources, and session notes.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-up">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-up animation-delay-100">
            Get expert advice in four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`relative text-center animate-fade-up animation-delay-${
                (index + 1) * 100
              }`}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              {/* Step Number */}
              <div className="relative inline-flex mb-6">
                <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-display font-bold text-sm">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
