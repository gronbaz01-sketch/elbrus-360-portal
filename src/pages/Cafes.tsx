import { useState, useEffect } from "react";
import { CafeCard } from "@/components/cards/CafeCard";
import { FilterChips } from "@/components/ui/FilterChips";
import { SocialWidgets } from "@/components/widgets/SocialWidgets";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const cuisineFilters = [
  { value: "all", label: "Все" },
  { value: "national", label: "Национальная кухня" },
  { value: "european", label: "Европейская" },
  { value: "fastfood", label: "Фастфуд" },
];

interface Cafe {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  cuisine_key: string;
  rating: number | null;
  price_range: string | null;
  description: string | null;
  image_url: string | null;
  phone: string | null;
}

const Cafes = () => {
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafes = async () => {
      const { data, error } = await supabase
        .from("cafes")
        .select("*")
        .order("rating", { ascending: false });

      if (!error && data) {
        setCafes(data);
      }
      setLoading(false);
    };

    fetchCafes();
  }, []);

  const filteredCafes = cafes.filter(
    (cafe) => selectedCuisine === "all" || cafe.cuisine_key === selectedCuisine
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-4">Кафе и рестораны</h1>
          <p className="text-muted-foreground max-w-2xl">
            Откройте вкус Кабардино-Балкарии. Хычины, шорпа, жау-баур и другие традиционные блюда.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <p className="text-sm font-medium text-foreground mb-3">Тип кухни:</p>
          <FilterChips
            filters={cuisineFilters}
            selected={selectedCuisine}
            onChange={setSelectedCuisine}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCafes.map((cafe) => (
              <CafeCard
                key={cafe.id}
                id={cafe.id}
                name={cafe.name}
                location={cafe.location}
                cuisine={cafe.cuisine}
                rating={cafe.rating ?? 4.5}
                priceRange={cafe.price_range ?? "₽₽"}
                description={cafe.description ?? undefined}
                imageUrl={cafe.image_url ?? undefined}
              />
            ))}
          </div>
        )}

        {!loading && filteredCafes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Нет кафе с выбранным типом кухни</p>
          </div>
        )}
      </div>

      <SocialWidgets variant="floating" />
    </div>
  );
};

export default Cafes;
