import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight, Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Mock articles - in production these would come from the database
const articles = [
  {
    id: 1,
    title: "Jak radzić sobie ze stresem w pracy",
    excerpt: "Poznaj sprawdzone techniki redukcji stresu...",
    author: "Dr Anna Kowalska",
    category: "Zdrowie psychiczne",
    readTime: "5 min",
    likes: 124,
    comments: 18,
  },
  {
    id: 2,
    title: "Znaczenie regularnych badań profilaktycznych",
    excerpt: "Dowiedz się, jakie badania wykonywać i kiedy...",
    author: "Dr Piotr Nowak",
    category: "Profilaktyka",
    readTime: "4 min",
    likes: 89,
    comments: 12,
  },
  {
    id: 3,
    title: "Zdrowa dieta dla zapracowanych",
    excerpt: "Praktyczne wskazówki żywieniowe dla osób...",
    author: "Mgr Ewa Zielińska",
    category: "Dietetyka",
    readTime: "6 min",
    likes: 156,
    comments: 23,
  },
];

const LatestArticles = () => {
  return (
    <Card className="gradient-card shadow-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Najnowsze artykuły</CardTitle>
        <Link to="/posts">
          <Button variant="ghost" size="sm" className="text-primary">
            Zobacz wszystkie
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/posts/${article.id}`}
              className="block p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground line-clamp-1">
                    {article.title}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {article.author} • {article.readTime}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {article.likes}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {article.comments}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestArticles;
