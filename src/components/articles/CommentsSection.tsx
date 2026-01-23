import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useArticleComments, useAddArticleComment, useDeleteArticleComment } from "@/hooks/useArticleComments";
import { Link } from "react-router-dom";

interface CommentsSectionProps {
  articleId: string;
}

export const CommentsSection = ({ articleId }: CommentsSectionProps) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  
  const { data: comments = [], isLoading } = useArticleComments(articleId);
  const { mutate: addComment, isPending: isAdding } = useAddArticleComment(articleId);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteArticleComment(articleId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    addComment(newComment, {
      onSuccess: () => setNewComment(""),
    });
  };

  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Komentarze ({comments.length})
      </h2>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Napisz komentarz..."
            className="mb-3 min-h-[100px] resize-none"
            maxLength={1000}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {newComment.length}/1000 znaków
            </span>
            <Button type="submit" disabled={isAdding || !newComment.trim()}>
              {isAdding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Dodaj komentarz
            </Button>
          </div>
        </form>
      ) : (
        <div className="gradient-card rounded-xl p-6 mb-8 text-center">
          <p className="text-muted-foreground mb-3">
            Zaloguj się, aby dodać komentarz
          </p>
          <Link to="/auth">
            <Button>Zaloguj się</Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="gradient-card rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Brak komentarzy. Bądź pierwszy!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="gradient-card rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent text-primary text-sm">
                    {getInitials(comment.user_name || "A")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">
                      {comment.user_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <time className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(comment.created_at), "d MMM yyyy, HH:mm", { locale: pl })}
                      </time>
                      {user?.id === comment.user_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteComment(comment.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
