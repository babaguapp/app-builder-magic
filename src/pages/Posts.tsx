import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Heart, MessageCircle, Bookmark, Search } from "lucide-react";

const allPosts = [
  {
    id: 1,
    title: "The Future of Remote Work: Insights from Industry Leaders",
    excerpt:
      "Discover how top executives are reshaping workplace culture and what it means for your career.",
    author: "Marcus Reid",
    category: "Business",
    readTime: 8,
    likes: 234,
    comments: 45,
    date: "Dec 15, 2024",
  },
  {
    id: 2,
    title: "5 Evidence-Based Strategies for Better Sleep",
    excerpt:
      "Sleep expert Dr. Chen shares proven techniques to improve your sleep quality tonight.",
    author: "Dr. Sarah Chen",
    category: "Health",
    readTime: 5,
    likes: 567,
    comments: 89,
    date: "Dec 14, 2024",
  },
  {
    id: 3,
    title: "AI in Healthcare: What Patients Need to Know",
    excerpt:
      "How artificial intelligence is transforming diagnosis and treatment options.",
    author: "Emily Torres",
    category: "Technology",
    readTime: 6,
    likes: 189,
    comments: 32,
    date: "Dec 13, 2024",
  },
  {
    id: 4,
    title: "Building Wealth in Your 30s: A Comprehensive Guide",
    excerpt:
      "Financial strategies that can set you up for long-term success and early retirement.",
    author: "Lisa Wang",
    category: "Finance",
    readTime: 12,
    likes: 445,
    comments: 67,
    date: "Dec 12, 2024",
  },
  {
    id: 5,
    title: "Navigating Career Transitions Successfully",
    excerpt:
      "How to pivot your career without starting from scratch - lessons from 500+ professionals.",
    author: "Alex Rivera",
    category: "Career",
    readTime: 7,
    likes: 312,
    comments: 54,
    date: "Dec 11, 2024",
  },
  {
    id: 6,
    title: "The Science of Stress Management",
    excerpt:
      "Understanding your stress response and practical tools to manage it effectively.",
    author: "Dr. James Okonkwo",
    category: "Health",
    readTime: 9,
    likes: 398,
    comments: 71,
    date: "Dec 10, 2024",
  },
];

const categories = ["All", "Health", "Business", "Technology", "Finance", "Career"];

const Posts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="py-12 md:py-20 gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
              Expert Insights
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up animation-delay-100">
              Fresh perspectives and actionable advice from our expert community
            </p>
          </div>

          {/* Search & Filter */}
          <div className="max-w-4xl mx-auto mb-12 animate-fade-up animation-delay-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
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

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className="group gradient-card rounded-2xl shadow-card overflow-hidden hover:shadow-hover transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-accent to-primary/20" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      {post.readTime} min
                    </div>
                  </div>

                  <h3 className="font-display font-semibold text-xl text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {post.author}
                        </p>
                        <p className="text-xs text-muted-foreground">{post.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">{post.comments}</span>
                      </button>
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No posts found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Posts;
