import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Utensils, Car, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-mountains.jpg";
import { SocialWidgets } from "@/components/widgets/SocialWidgets";
import { HeroCameras } from "@/components/widgets/HeroCameras";
import { CompactWeather } from "@/components/widgets/CompactWeather";
import { AnnouncementsStrip } from "@/components/widgets/AnnouncementsStrip";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { ElbrusMap } from "@/components/ElbrusMap";
import { FAQSection } from "@/components/FAQSection";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      }
    }
  }, [location]);

  const services = [
    {
      icon: Home,
      title: "Жильё",
      description: "Уютные квартиры и апартаменты в Терсколе, Азау, Чегете и Байдаево",
      link: "/apartments",
      color: "from-primary to-mountain-blue-light",
    },
    {
      icon: Utensils,
      title: "Еда",
      description: "Лучшие кафе с национальной кухней Кабардино-Балкарии",
      link: "/cafes",
      color: "from-sunset to-sunrise-gold",
    },
    {
      icon: Car,
      title: "Такси",
      description: "Проверенные водители для трансфера и экскурсий",
      link: "/taxi",
      color: "from-forest-green to-mountain-blue-light",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col overflow-hidden px-4 pt-20 md:pt-24 pb-6">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Эльбрус" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Верхний ряд: камеры + погода */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3 mt-2">
          <HeroCameras />
          <CompactWeather />
        </div>

        {/* Центр: заголовок */}
        <div className="relative z-10 flex-1 flex items-center justify-center text-center py-8">
          <div className="container mx-auto px-4 text-white max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-up">
              Ваш гид по
              <br />
              <span className="text-accent">Приэльбрусью</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Жильё, еда, трансфер и веб-камеры склонов — подберите поездку под свой бюджет за
              пару минут.
            </p>

            <div
              className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <a href="#budget" className="btn-hero">
                Рассчитать бюджет поездки
              </a>
              {services.map((service) => (
                <Link key={service.title} to={service.link} className="btn-hero-outline">
                  <service.icon className="w-5 h-5" />
                  {service.title}
                </Link>
              ))}
            </div>

            <div className="hidden md:block animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <p className="text-sm text-white/60 mb-3">Свяжитесь с нами</p>
              <SocialWidgets variant="hero" />
            </div>
          </div>
        </div>

        {/* Нижний ряд: рекламная полоса */}
        <div className="relative z-10 w-full max-w-6xl mx-auto pb-2">
          <AnnouncementsStrip />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Наши услуги</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Всё необходимое для комфортного отдыха в Приэльбрусье
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="glass-card p-8 text-center group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mx-auto mb-5 text-white group-hover:scale-110 transition-transform`}
                >
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                  Подробнее <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BudgetCalculator />
      <ElbrusMap />
      <FAQSection />

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-mountain text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Готовы к приключениям?
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            Свяжитесь с нами, и мы поможем организовать идеальный отдых в Приэльбрусье
          </p>
          <SocialWidgets variant="hero" />
        </div>
      </section>

      <SocialWidgets variant="floating" />
    </div>
  );
};

export default Index;
