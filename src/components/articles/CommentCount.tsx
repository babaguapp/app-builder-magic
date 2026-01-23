import { MessageCircle } from "lucide-react";
import { useArticleCommentsCount } from "@/hooks/useArticleComments";

interface CommentCountProps {
  articleId: string;
  size?: "sm" | "default";
}

export const CommentCount = ({ articleId, size = "default" }: CommentCountProps) => {
  const { data: count = 0 } = useArticleCommentsCount(articleId);

  return (
    <span className="flex items-center gap-1 text-muted-foreground">
      <MessageCircle className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
      <span className={size === "sm" ? "text-xs" : "text-sm"}>{count}</span>
    </span>
  );
};
