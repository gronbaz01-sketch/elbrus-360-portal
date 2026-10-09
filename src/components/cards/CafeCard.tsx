import { MessageCircle, MapPin, Star, Utensils } from "lucide-react";

interface CafeCardProps {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  imageUrl?: string;
  rating?: number;
  priceRange?: string;
  description?: string;
}

export const CafeCard = ({
  id,
  name,
  location,
  cuisine,
  imageUrl,
  rating = 4.7,
  priceRange = "₽₽",
  description,
}: CafeCardProps) => {
  const whatsappMessage = `Здравствуйте! Хотел бы забронировать столик в кафе "${name}". Подскажите, есть ли свободные места?`;
  const whatsappUrl = `https://wa.me/79281234567?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="glass-card overflow-hidden group">
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sunset/20 to-accent/10 flex items-center justify-center">
            <Utensils className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Cuisine badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium">
          {cuisine}
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
          <Star className="w-4 h-4 text-sunrise-gold fill-sunrise-gold" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-lg font-semibold text-muted-foreground">{priceRange}</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Забронировать</span>
          </a>
        </div>
      </div>
    </div>
  );
};
