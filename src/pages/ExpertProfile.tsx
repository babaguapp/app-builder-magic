import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Heart
} from "lucide-react";

// Mock data - in a real app this would come from the database
const allExperts = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Health & Wellness",
    category: "Health",
    rating: 4.9,
    reviewCount: 127,
    sessions: 342,
    rate: 150,
    bio: "Board-certified physician with 15+ years in integrative medicine. Specializing in preventive care and holistic wellness approaches.",
    longBio: "Dr. Sarah Chen is a board-certified physician with over 15 years of experience in integrative medicine. She combines traditional medical practices with holistic approaches to help patients achieve optimal health and wellness. Her expertise includes preventive care, nutrition counseling, stress management, and chronic disease prevention.",
    available: true,
    languages: ["English", "Mandarin"],
    education: [
      "MD, Harvard Medical School",
      "Residency, Johns Hopkins Hospital",
      "Fellowship in Integrative Medicine, Stanford"
    ],
    certifications: [
      "Board Certified in Internal Medicine",
      "Certified Integrative Medicine Practitioner",
      "Nutrition Specialist Certification"
    ],
    location: "San Francisco, CA",
    experience: "15+ years",
    nextAvailable: "Tomorrow, 10:00 AM",
  },
  {
    id: 2,
    name: "Marcus Reid",
    specialty: "Business Strategy",
    category: "Business",
    rating: 4.8,
    reviewCount: 203,
    sessions: 521,
    rate: 200,
    bio: "Former Fortune 500 executive, startup advisor and mentor.",
    longBio: "Marcus Reid brings over 20 years of corporate leadership experience to his consulting practice. As a former C-suite executive at multiple Fortune 500 companies, he has guided businesses through transformational changes, mergers, and rapid growth phases. His approach combines strategic thinking with practical implementation strategies.",
    available: true,
    languages: ["English", "Spanish"],
    education: [
      "MBA, Wharton School of Business",
      "BS in Economics, MIT"
    ],
    certifications: [
      "Certified Executive Coach",
      "Six Sigma Black Belt"
    ],
    location: "New York, NY",
    experience: "20+ years",
    nextAvailable: "Today, 3:00 PM",
  },
  {
    id: 3,
    name: "Emily Torres",
    specialty: "Tech & Innovation",
    category: "Technology",
    rating: 5.0,
    reviewCount: 89,
    sessions: 189,
    rate: 175,
    bio: "AI researcher and tech entrepreneur with 3 successful exits.",
    longBio: "Emily Torres is a pioneering AI researcher and successful tech entrepreneur. With three successful startup exits under her belt, she brings both technical expertise and business acumen to her consulting practice. She specializes in helping companies leverage emerging technologies to drive innovation and competitive advantage.",
    available: false,
    languages: ["English", "Portuguese"],
    education: [
      "PhD in Computer Science, Stanford",
      "MS in Artificial Intelligence, Carnegie Mellon"
    ],
    certifications: [
      "Google Cloud Professional",
      "AWS Solutions Architect"
    ],
    location: "Austin, TX",
    experience: "12+ years",
    nextAvailable: "Next week",
  },
  {
    id: 4,
    name: "Dr. James Okonkwo",
    specialty: "Mental Health",
    category: "Health",
    rating: 4.9,
    reviewCount: 156,
    sessions: 456,
    rate: 180,
    bio: "Licensed psychologist specializing in cognitive behavioral therapy.",
    longBio: "Dr. James Okonkwo is a licensed clinical psychologist with extensive experience in cognitive behavioral therapy (CBT) and mindfulness-based interventions. He has helped hundreds of clients overcome anxiety, depression, and stress-related issues through evidence-based therapeutic approaches.",
    available: true,
    languages: ["English", "Yoruba"],
    education: [
      "PsyD, University of Pennsylvania",
      "MA in Clinical Psychology, Columbia University"
    ],
    certifications: [
      "Licensed Clinical Psychologist",
      "Certified CBT Practitioner",
      "Mindfulness-Based Stress Reduction Instructor"
    ],
    location: "Chicago, IL",
    experience: "18+ years",
    nextAvailable: "Tomorrow, 2:00 PM",
  },
  {
    id: 5,
    name: "Lisa Wang",
    specialty: "Financial Planning",
    category: "Finance",
    rating: 4.7,
    reviewCount: 94,
    sessions: 298,
    rate: 165,
    bio: "Certified financial planner helping clients build wealth for 10+ years.",
    longBio: "Lisa Wang is a Certified Financial Planner™ with over a decade of experience helping individuals and families achieve their financial goals. Her comprehensive approach covers investment strategy, retirement planning, tax optimization, and estate planning.",
    available: true,
    languages: ["English", "Cantonese"],
    education: [
      "MBA, NYU Stern School of Business",
      "BS in Finance, UCLA"
    ],
    certifications: [
      "Certified Financial Planner (CFP)",
      "Chartered Financial Analyst (CFA)"
    ],
    location: "Los Angeles, CA",
    experience: "10+ years",
    nextAvailable: "Today, 5:00 PM",
  },
  {
    id: 6,
    name: "Alex Rivera",
    specialty: "Career Coaching",
    category: "Career",
    rating: 4.8,
    reviewCount: 178,
    sessions: 412,
    rate: 120,
    bio: "Executive coach who has helped 500+ professionals land their dream jobs.",
    longBio: "Alex Rivera is a career transformation specialist who has guided over 500 professionals through successful career transitions. From resume optimization to interview mastery and salary negotiation, Alex provides comprehensive support for career advancement at all levels.",
    available: true,
    languages: ["English", "Spanish"],
    education: [
      "MS in Organizational Psychology, Northwestern University",
      "BA in Communications, USC"
    ],
    certifications: [
      "Certified Professional Career Coach",
      "Executive Leadership Coach Certification"
    ],
    location: "Miami, FL",
    experience: "8+ years",
    nextAvailable: "Tomorrow, 11:00 AM",
  },
];

const ExpertProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const expert = allExperts.find((e) => e.id === Number(id));

  if (!expert) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Nie znaleziono lekarza</h1>
            <p className="text-muted-foreground mb-4">Przepraszamy, nie mogliśmy znaleźć tego profilu.</p>
            <Link to="/experts">
              <Button>Wróć do listy lekarzy</Button>
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
                  <AvatarImage src={undefined} alt={expert.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent text-2xl md:text-3xl font-semibold text-primary">
                    {getInitials(expert.name)}
                  </AvatarFallback>
                </Avatar>
                {expert.available && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-card" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {expert.name}
                  </h1>
                  {expert.available ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Dostępny
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      Niedostępny
                    </Badge>
                  )}
                </div>
                
                <p className="text-lg text-primary font-medium mb-3">{expert.specialty}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="font-semibold text-foreground">{expert.rating}</span>
                    <span>({expert.reviewCount} opinii)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    <span>{expert.sessions} sesji</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{expert.location}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-3">
                <div className="text-center md:text-right">
                  <span className="font-display text-3xl font-bold text-foreground">${expert.rate}</span>
                  <span className="text-muted-foreground">/sesja</span>
                </div>
                <Link to={`/bookings?expert=${expert.id}`} className="w-full md:w-auto">
                  <Button size="lg" className="w-full" disabled={!expert.available}>
                    <Calendar className="w-5 h-5" />
                    Umów wizytę
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Info */}
            {expert.available && expert.nextAvailable && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Najbliższy termin: </span>
                  <span className="font-medium text-foreground">{expert.nextAvailable}</span>
                </span>
              </div>
            )}

            {/* Bio */}
            <div className="mb-8">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">O mnie</h2>
              <p className="text-muted-foreground leading-relaxed">{expert.longBio}</p>
            </div>

            {/* Languages */}
            <div className="mb-8">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Języki</h2>
              <div className="flex flex-wrap gap-2">
                {expert.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Education */}
            <div className="gradient-card rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-foreground">Wykształcenie</h2>
              </div>
              <ul className="space-y-3">
                {expert.education.map((edu, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div className="gradient-card rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-foreground">Certyfikaty</h2>
              </div>
              <ul className="space-y-3">
                {expert.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Card */}
          <div className="gradient-card rounded-2xl shadow-card p-6 text-center">
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Gotowy na konsultację?
            </h3>
            <p className="text-muted-foreground mb-4">
              Umów się na wizytę online z {expert.name.split(" ")[0]}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={`/bookings?expert=${expert.id}`}>
                <Button size="lg" disabled={!expert.available}>
                  <Video className="w-5 h-5" />
                  Umów wizytę wideo
                </Button>
              </Link>
              <Button size="lg" variant="outline" disabled={!expert.available}>
                <MessageCircle className="w-5 h-5" />
                Wyślij wiadomość
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ExpertProfile;
