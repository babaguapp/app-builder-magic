import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Clock, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2,
  Calendar
} from "lucide-react";
import { useArticle } from "@/hooks/useArticles";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: article, isLoading, error } = useArticle(id || "");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Layout>
        <article className="py-6 md:py-12 gradient-hero min-h-screen">
          <div className="container mx-auto px-4 max-w-3xl">
            <Skeleton className="h-6 w-20 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-4 py-6">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Nie znaleziono artykułu</h1>
            <p className="text-muted-foreground mb-4">Przepraszamy, ten artykuł nie istnieje.</p>
            <Link to="/posts">
              <Button>Wróć do artykułów</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-6 md:py-12 gradient-hero min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Wróć</span>
          </button>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                {article.read_time} min czytania
              </div>
            </div>

            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent text-primary font-semibold">
                    {getInitials(article.author)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{article.author}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(article.created_at), "d MMMM yyyy", { locale: pl })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Author Bio */}
          {article.author_bio && (
            <div className="gradient-card rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent text-primary font-semibold text-lg">
                    {getInitials(article.author)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">O autorze</p>
                  <p className="font-semibold text-foreground mb-2">{article.author}</p>
                  <p className="text-muted-foreground text-sm">{article.author_bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center justify-center gap-8 py-6 border-t border-b border-border">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{article.likes}</span>
              <span className="text-muted-foreground">polubień</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{article.comments}</span>
              <span className="text-muted-foreground">komentarzy</span>
            </div>
          </div>

          {/* Back to Articles */}
          <div className="text-center mt-8">
            <Link to="/posts">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Wróć do artykułów
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default PostDetail;
