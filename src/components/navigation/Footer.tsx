import { Link } from "react-router-dom";
import { Mountain, Phone, Mail, MapPin } from "lucide-react";
import { SocialWidgets } from "../widgets/SocialWidgets";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Mountain className="w-8 h-8 text-accent" />
              <span className="text-xl font-display font-bold">
                Приэльбрусье <span className="text-accent">360</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Ваш надёжный гид по Кабардино-Балкарии. Жильё, еда, транспорт — всё в одном месте.
            </p>
            <SocialWidgets variant="footer" />
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Разделы</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link to="/apartments" className="hover:text-white transition-colors">Жильё</Link></li>
              <li><Link to="/cafes" className="hover:text-white transition-colors">Кафе</Link></li>
              <li><Link to="/taxi" className="hover:text-white transition-colors">Такси</Link></li>
              <li><Link to="/cameras" className="hover:text-white transition-colors">Онлайн камеры</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-semibold mb-4">Локации</h4>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                Терскол
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                Поляна Азау
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                Байдаево
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                Поляна Чегет
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                +7 (928) 123-45-67
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                info@turmir.ru
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} Приэльбрусье 360. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
