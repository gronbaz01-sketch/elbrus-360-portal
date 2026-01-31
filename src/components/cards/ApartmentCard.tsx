import { MessageCircle, MapPin, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApartmentCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl?: string;
  rating?: number;
  guests?: number;
  description?: string;
}

export const ApartmentCard = ({
  id,
  title,
  location,
  price,
  imageUrl,
  rating = 4.8,
  guests = 4,
  description,
}: ApartmentCardProps) => {
  const whatsappMessage = `Здравствуйте! Интересует квартира "${title}" в ${location}. Подскажите, есть ли свободные даты?`;
  const whatsappUrl = `https://wa.me/79281234567?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="glass-card overflow-hidden group">
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-mountain-blue/20 to-accent/10 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        
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

        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>до {guests} гостей</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-foreground">{price.toLocaleString('ru-RU')} ₽</span>
            <span className="text-sm text-muted-foreground"> / сутки</span>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Написать</span>
          </a>
        </div>
      </div>
    </div>
  );
};
