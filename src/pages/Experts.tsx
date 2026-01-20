import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Video, Search, Filter } from "lucide-react";

const allExperts = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Health & Wellness",
    category: "Health",
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
    category: "Business",
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
    category: "Technology",
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
    category: "Health",
    rating: 4.9,
    sessions: 456,
    rate: 180,
    bio: "Licensed psychologist specializing in cognitive behavioral therapy.",
    available: true,
  },
  {
    id: 5,
    name: "Lisa Wang",
    specialty: "Financial Planning",
    category: "Finance",
    rating: 4.7,
    sessions: 298,
    rate: 165,
    bio: "Certified financial planner helping clients build wealth for 10+ years.",
    available: true,
  },
  {
    id: 6,
    name: "Alex Rivera",
    specialty: "Career Coaching",
    category: "Career",
    rating: 4.8,
    sessions: 412,
    rate: 120,
    bio: "Executive coach who has helped 500+ professionals land their dream jobs.",
    available: true,
  },
];

const categories = ["All", "Health", "Business", "Technology", "Finance", "Career"];

const Experts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredExperts = allExperts.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || expert.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="py-12 md:py-20 gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
              Find Your Expert
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up animation-delay-100">
              Browse our curated network of verified professionals
            </p>
          </div>

          {/* Search & Filter */}
          <div className="max-w-4xl mx-auto mb-12 animate-fade-up animation-delay-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 rounded-xl"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Experts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert, index) => (
              <div
                key={expert.id}
                className={`group gradient-card rounded-2xl shadow-card p-6 hover:shadow-hover transition-all duration-300 animate-fade-up`}
                style={{ animationDelay: `${index * 50}ms` }}
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
                    <Button size="sm" variant="soft" disabled={!expert.available}>
                      <Video className="w-4 h-4" />
                      {expert.available ? "Book" : "Unavailable"}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredExperts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No experts found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Experts;
