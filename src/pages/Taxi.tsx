import { useState, useEffect } from "react";
import { TaxiCard } from "@/components/cards/TaxiCard";
import { SocialWidgets } from "@/components/widgets/SocialWidgets";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Clock, MapPin } from "lucide-react";

interface TaxiService {
  id: string;
  name: string;
  phone: string;
  description: string | null;
  rating: number | null;
  verified: boolean | null;
}

const features = [
  {
    icon: Shield,
    title: "Проверенные водители",
    description: "Все водители проходят проверку и имеют отличные отзывы",
  },
  {
    icon: Clock,
    title: "Круглосуточно",
    description: "Такси доступно 24/7, включая ранние рейсы и ночные поездки",
  },
  {
    icon: MapPin,
    title: "Знание местности",
    description: "Опытные водители знают все дороги и достопримечательности",
  },
];

const Taxi = () => {
  const [taxiServices, setTaxiServices] = useState<TaxiService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaxi = async () => {
      const { data, error } = await supabase
        .from("taxi_services")
        .select("*")
        .order("rating", { ascending: false });

      if (!error && data) {
        setTaxiServices(data);
      }
      setLoading(false);
    };

    fetchTaxi();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-4">Такси и трансфер</h1>
          <p className="text-muted-foreground max-w-2xl">
            Проверенные водители для комфортных поездок по Приэльбрусью. Трансфер из аэропорта, экскурсии, поездки к достопримечательностям.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {taxiServices.map((taxi) => (
              <TaxiCard
                key={taxi.id}
                id={taxi.id}
                name={taxi.name}
                phone={taxi.phone}
                description={taxi.description ?? undefined}
                rating={taxi.rating ?? 4.5}
                verified={taxi.verified ?? false}
              />
            ))}
          </div>
        )}

        {!loading && taxiServices.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Нет доступных служб такси</p>
          </div>
        )}
      </div>

      <SocialWidgets variant="floating" />
    </div>
  );
};

export default Taxi;
