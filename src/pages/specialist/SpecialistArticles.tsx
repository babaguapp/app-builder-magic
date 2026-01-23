import { useState } from "react";
import { SpecialistLayout } from "@/components/specialist/SpecialistLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SpecialistArticles = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["specialist-articles", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { mutate: saveArticle, isPending: isSaving } = useMutation({
    mutationFn: async (article: any) => {
      if (!user) throw new Error("Nie jesteś zalogowany");

      if (article.id) {
        const { error } = await supabase
          .from("articles")
          .update({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            is_published: article.is_published,
          })
          .eq("id", article.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("articles")
          .insert({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            author: article.author,
            author_id: user.id,
            is_published: article.is_published,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialist-articles"] });
      setDialogOpen(false);
      setEditingArticle(null);
      toast.success(editingArticle ? "Artykuł zaktualizowany" : "Artykuł dodany");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteArticle } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialist-articles"] });
      setDeleteId(null);
      toast.success("Artykuł usunięty");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const openEditDialog = (article: any) => {
    setEditingArticle(article);
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingArticle(null);
    setDialogOpen(true);
  };

  return (
    <SpecialistLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Moje artykuły
            </h1>
            <p className="text-muted-foreground mt-1">
              Twórz i zarządzaj swoimi artykułami
            </p>
          </div>
          
          <Button onClick={openNewDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nowy artykuł
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nie masz jeszcze żadnych artykułów</p>
            <Button onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Napisz pierwszy artykuł
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {article.title}
                        </h3>
                        <Badge variant={article.is_published ? "default" : "secondary"}>
                          {article.is_published ? "Opublikowany" : "Szkic"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.excerpt}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(article.created_at), "d MMM yyyy", { locale: pl })} • {article.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/posts/${article.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(article)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(article.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        article={editingArticle}
        onSave={saveArticle}
        isSaving={isSaving}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć artykuł?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteArticle(deleteId)}
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SpecialistLayout>
  );
};

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: any;
  onSave: (article: any) => void;
  isSaving: boolean;
}

const ArticleDialog = ({ open, onOpenChange, article, onSave, isSaving }: ArticleDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    is_published: false,
  });

  // Reset form when dialog opens
  useState(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        category: article.category || "",
        author: article.author || "",
        is_published: article.is_published || false,
      });
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        is_published: false,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: article?.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? "Edytuj artykuł" : "Nowy artykuł"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tytuł</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Tytuł artykułu"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Imię i nazwisko"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="np. Zdrowie"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Zajawka</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Krótki opis artykułu..."
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Treść (HTML)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="<p>Treść artykułu...</p>"
              className="min-h-[200px] font-mono text-sm"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="is_published">Opublikuj od razu</Label>
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {article ? "Zapisz zmiany" : "Dodaj artykuł"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialistArticles;
