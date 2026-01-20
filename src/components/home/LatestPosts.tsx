import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Heart, MessageCircle, Bookmark } from "lucide-react";

const posts = [
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
    featured: true,
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
    featured: false,
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
    featured: false,
  },
];

const LatestPosts = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 animate-fade-up">
              Latest Insights
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-up animation-delay-100">
              Fresh perspectives from our expert community
            </p>
          </div>
          <Link to="/posts">
            <Button variant="outline" className="animate-fade-up animation-delay-200">
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured Post */}
          <div className="lg:col-span-2 lg:row-span-2 group">
            <article className="h-full gradient-card rounded-2xl shadow-card overflow-hidden hover:shadow-hover transition-all duration-300 animate-fade-up">
              <div className="aspect-[16/9] lg:aspect-auto lg:h-64 bg-gradient-to-br from-primary/20 to-accent relative">
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                    {posts[0].category}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    {posts[0].readTime} min read
                  </div>
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {posts[0].title}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-2 lg:line-clamp-3">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent" />
                    <span className="font-medium text-foreground">
                      {posts[0].author}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{posts[0].likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{posts[0].comments}</span>
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Side Posts */}
          {posts.slice(1).map((post, index) => (
            <article
              key={post.id}
              className={`group gradient-card rounded-2xl shadow-card overflow-hidden hover:shadow-hover transition-all duration-300 animate-fade-up animation-delay-${
                (index + 1) * 100
              }`}
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-accent to-primary/20" />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent" />
                    <span className="text-sm font-medium text-foreground">
                      {post.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{post.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
