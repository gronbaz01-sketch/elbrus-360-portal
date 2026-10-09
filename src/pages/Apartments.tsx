import { useState, useEffect } from "react";
import { ApartmentCard } from "@/components/cards/ApartmentCard";
import { FilterChips } from "@/components/ui/FilterChips";
import { SocialWidgets } from "@/components/widgets/SocialWidgets";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const locationFilters = [
  { value: "all", label: "Все" },
  { value: "terskol", label: "Терскол" },
  { value: "azau", label: "Азау" },
  { value: "baidaevo", label: "Байдаево" },
];

interface Apartment {
  id: string;
  title: string;
  location: string;
  location_key: string;
  price: number;
  rating: number | null;
  guests: number | null;
  description: string | null;
  image_url: string | null;
  phone: string | null;
}

const Apartments = () => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setApartments(data);
      }
      setLoading(false);
    };

    fetchApartments();
  }, []);

  const filteredApartments = apartments.filter(
    (apt) => selectedLocation === "all" || apt.location_key === selectedLocation
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-4">Жильё в Приэльбрусье</h1>
          <p className="text-muted-foreground max-w-2xl">
            Выберите уютное жильё для вашего отдыха в горах. Квартиры и апартаменты в Терсколе, на Азау и в Байдаево.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <p className="text-sm font-medium text-foreground mb-3">Посёлок:</p>
          <FilterChips
            filters={locationFilters}
            selected={selectedLocation}
            onChange={setSelectedLocation}
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
            {filteredApartments.map((apt) => (
              <ApartmentCard
                key={apt.id}
                id={apt.id}
                title={apt.title}
                location={apt.location}
                price={apt.price}
                rating={apt.rating ?? 4.5}
                guests={apt.guests ?? 2}
                description={apt.description ?? undefined}
                imageUrl={apt.image_url ?? undefined}
              />
            ))}
          </div>
        )}

        {!loading && filteredApartments.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Нет доступных вариантов в выбранном посёлке</p>
          </div>
        )}
      </div>

      <SocialWidgets variant="floating" />
    </div>
  );
};

export default Apartments;
