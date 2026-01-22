import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Video, MapPin, Building2 } from "lucide-react";
import { Expert } from "@/hooks/useExperts";

interface ExpertCardProps {
  expert: Expert;
  onBookClick: (e: React.MouseEvent, expert: Expert) => void;
}

const ExpertCard = ({ expert, onBookClick }: ExpertCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isAvailable = expert.offers_online || expert.offers_in_person;
  const minRate = Math.min(
    expert.rate_online || Infinity,
    expert.rate_in_person || Infinity
  );
  const displayRate = minRate === Infinity ? null : minRate;

  return (
    <Link
      to={`/experts/${expert.id}`}
      className="group gradient-card rounded-2xl shadow-card p-6 hover:shadow-hover transition-all duration-300 block"
    >
      {/* Avatar */}
      <div className="relative mb-4">
        <Avatar className="w-20 h-20 mx-auto">
          <AvatarImage src={expert.avatar_url || undefined} alt={expert.name} />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent text-lg font-semibold">
            {getInitials(expert.name)}
          </AvatarFallback>
        </Avatar>
        {isAvailable && (
          <div className="absolute bottom-0 right-1/2 translate-x-8 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card" />
        )}
      </div>

      {/* Info */}
      <div className="text-center mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
          {expert.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{expert.specialty}</p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-medium text-foreground">
            {expert.rating}
          </span>
          <span className="text-sm text-muted-foreground">
            ({expert.sessions_count} sesji)
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{expert.city}</span>
        </div>
      </div>

      {/* Consultation Types */}
      <div className="flex justify-center gap-2 mb-4">
        {expert.offers_online && (
          <Badge variant="secondary" className="text-xs">
            <Video className="w-3 h-3 mr-1" />
            Online
          </Badge>
        )}
        {expert.offers_in_person && (
          <Badge variant="secondary" className="text-xs">
            <Building2 className="w-3 h-3 mr-1" />
            Stacjonarnie
          </Badge>
        )}
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-2">
        {expert.bio}
      </p>

      {/* Price & Action */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          {displayRate ? (
            <>
              <span className="text-sm text-muted-foreground">od </span>
              <span className="font-display font-bold text-lg text-foreground">
                {displayRate} zł
              </span>
              <span className="text-sm text-muted-foreground">/sesja</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Brak cen</span>
          )}
        </div>
        <Button
          size="sm"
          disabled={!isAvailable}
          onClick={(e) => onBookClick(e, expert)}
        >
          <Video className="w-4 h-4" />
          {isAvailable ? "Umów" : "Niedostępny"}
        </Button>
      </div>
    </Link>
  );
};

export default ExpertCard;
