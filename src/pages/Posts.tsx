import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Search } from "lucide-react";
import { useArticles, useArticleCategories } from "@/hooks/useArticles";
import { LikeButton } from "@/components/articles/LikeButton";
import { CommentCount } from "@/components/articles/CommentCount";

const Posts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");

  const { data: articles = [], isLoading } = useArticles(searchTerm, selectedCategory);
  const { data: categories = ["Wszystkie"] } = useArticleCategories();

  return (
    <Layout>
      <section className="py-12 md:py-20 gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
              Artykuły
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up animation-delay-100">
              Praktyczne porady i wiedza od naszych specjalistów
            </p>
          </div>

          {/* Search & Filter */}
          <div className="max-w-4xl mx-auto mb-12 animate-fade-up animation-delay-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Szukaj artykułów..."
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

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="gradient-card rounded-2xl shadow-card overflow-hidden">
                  <Skeleton className="aspect-[16/9]" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {!isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/posts/${article.id}`}
                  className="group gradient-card rounded-2xl shadow-card overflow-hidden hover:shadow-hover transition-all duration-300 animate-fade-up block"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-accent to-primary/20" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" />
                        {article.read_time} min
                      </div>
                    </div>

                    <h3 className="font-display font-semibold text-xl text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {article.author}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(article.created_at), "d MMM yyyy", { locale: pl })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <LikeButton articleId={article.id} size="sm" />
                        <CommentCount articleId={article.id} size="sm" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && articles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                Nie znaleziono artykułów spełniających kryteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Posts;
