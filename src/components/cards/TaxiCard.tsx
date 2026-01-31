import { Phone, MessageCircle, Car, Star, CheckCircle } from "lucide-react";

interface TaxiCardProps {
  id: string;
  name: string;
  phone: string;
  description?: string;
  rating?: number;
  verified?: boolean;
}

export const TaxiCard = ({
  id,
  name,
  phone,
  description,
  rating = 4.9,
  verified = true,
}: TaxiCardProps) => {
  const formattedPhone = phone.replace(/[^0-9+]/g, '');
  const whatsappMessage = `Здравствуйте! Нужно такси в Приэльбрусье. Подскажите стоимость поездки?`;
  const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-mountain-blue-light flex items-center justify-center text-white">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{name}</h3>
              {verified && (
                <CheckCircle className="w-4 h-4 text-forest-green" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-3 h-3 text-sunrise-gold fill-sunrise-gold" />
              <span>{rating}</span>
              {verified && <span className="ml-1">• Проверенный</span>}
            </div>
          </div>
        </div>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}

      <div className="flex items-center gap-3">
        <a
          href={`tel:${formattedPhone}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:bg-primary/90"
        >
          <Phone className="w-4 h-4" />
          <span>{phone}</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-xl transition-all hover:bg-[#20BD5A]"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};
