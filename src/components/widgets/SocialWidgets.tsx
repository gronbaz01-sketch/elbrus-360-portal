import { MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialWidgetsProps {
  variant?: "hero" | "footer" | "floating";
}

export const SocialWidgets = ({ variant = "hero" }: SocialWidgetsProps) => {
  const telegramUrl = "https://t.me/turmir_elbrus";
  const whatsappUrl = "https://wa.me/79281234567?text=Здравствуйте! Хочу узнать подробнее об услугах Приэльбрусья.";

  if (variant === "floating") {
    return (
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#0088CC] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          aria-label="Telegram"
        >
          <Send className="w-6 h-6" />
        </a>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex gap-3",
      variant === "hero" && "justify-center",
      variant === "footer" && "justify-start"
    )}>
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="telegram-btn"
      >
        <Send className="w-5 h-5" />
        <span>Telegram</span>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
      >
        <MessageCircle className="w-5 h-5" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};
