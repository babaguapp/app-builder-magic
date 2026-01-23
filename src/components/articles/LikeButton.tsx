import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useArticleLikesCount, useUserLikedArticle, useToggleArticleLike } from "@/hooks/useArticleLikes";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface LikeButtonProps {
  articleId: string;
  variant?: "icon" | "full";
  size?: "sm" | "default";
}

export const LikeButton = ({ articleId, variant = "full", size = "default" }: LikeButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: likesCount = 0 } = useArticleLikesCount(articleId);
  const { data: isLiked = false } = useUserLikedArticle(articleId);
  const { mutate: toggleLike, isPending } = useToggleArticleLike(articleId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate("/auth");
      return;
    }
    
    toggleLike();
  };

  if (variant === "icon") {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={handleClick}
        disabled={isPending}
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-colors",
            isLiked && "fill-red-500 text-red-500"
          )} 
        />
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1 transition-colors",
        isLiked 
          ? "text-red-500" 
          : "text-muted-foreground hover:text-red-500",
        isPending && "opacity-50 cursor-not-allowed"
      )}
    >
      <Heart 
        className={cn(
          size === "sm" ? "w-4 h-4" : "w-5 h-5",
          isLiked && "fill-current"
        )} 
      />
      <span className={size === "sm" ? "text-xs" : "text-sm"}>
        {likesCount}
      </span>
    </button>
  );
};
