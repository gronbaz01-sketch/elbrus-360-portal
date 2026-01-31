import { Link } from "react-router-dom";
import { Home, Utensils, Car, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-mountains.jpg";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { SocialWidgets } from "@/components/widgets/SocialWidgets";
import { CameraCard } from "@/components/widgets/CameraCard";

const Index = () => {
  const services = [
    {
      icon: Home,
      title: "Жильё",
      description: "Уютные квартиры и апартаменты в Терсколе, Азау и Байдаево",
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

  const cameras = [
    { name: "Поляна Азау", description: "Подъёмник на Эльбрус, высота 2350 м" },
    { name: "Станция Мир", description: "Панорама на высоте 3500 м" },
    { name: "Поляна Чегет", description: "Вид на горнолыжные трассы" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Эльбрус"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-up">
            Ваш гид по
            <br />
            <span className="text-accent">Кабардино-Балкарии</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Откройте для себя величие Эльбруса. Жильё, еда, транспорт — всё для идеального отдыха в горах.
          </p>

          {/* Service Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="btn-hero"
              >
                <service.icon className="w-5 h-5" />
                {service.title}
              </Link>
            ))}
          </div>

          {/* Social Widgets */}
          <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-sm text-white/60 mb-3">Свяжитесь с нами</p>
            <SocialWidgets variant="hero" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
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
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mx-auto mb-5 text-white group-hover:scale-110 transition-transform`}>
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

      {/* Weather & Cameras Section */}
      <section className="py-20 md:py-28 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weather Widget */}
            <div>
              <h2 className="section-title mb-6">Погода</h2>
              <WeatherWidget />
            </div>

            {/* Cameras */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Камеры онлайн</h2>
                <Link
                  to="/cameras"
                  className="text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  Все камеры <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cameras.map((camera) => (
                  <CameraCard
                    key={camera.name}
                    name={camera.name}
                    description={camera.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Floating Social Widgets */}
      <SocialWidgets variant="floating" />
    </div>
  );
};

export default Index;
