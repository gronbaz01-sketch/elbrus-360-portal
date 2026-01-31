import { CameraCard } from "@/components/widgets/CameraCard";
import { SocialWidgets } from "@/components/widgets/SocialWidgets";
import { Info } from "lucide-react";

// Камеры - ВСТАВИТЬ ПРЯМЫЕ ССЫЛКИ HLS/MP4 ЗДЕСЬ
const cameras = [
  {
    name: "Поляна Азау",
    description: "Вид на подъёмник и начало трасс, высота 2350 м",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  },
  {
    name: "Станция Мир",
    description: "Панорама Эльбруса на высоте 3500 м",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  },
  {
    name: "Поляна Чегет",
    description: "Горнолыжные трассы Чегета",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  },
  {
    name: "Терскол центр",
    description: "Центральная площадь посёлка Терскол",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  },
  {
    name: "Гара-Баши",
    description: "Верхняя станция канатной дороги, 3847 м",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  },
  {
    name: "Чегет-3",
    description: "Вершина горы Чегет, 3050 м",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  },
];

const Cameras = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-4">Камеры онлайн</h1>
          <p className="text-muted-foreground max-w-2xl">
            Смотрите погоду и состояние трасс в реальном времени. Прямые трансляции с ключевых точек Приэльбрусья.
          </p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 mb-8">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Подключение камер</p>
            <p className="text-muted-foreground">
              Камеры работают в режиме реального времени. Если видео недоступно, попробуйте обновить страницу позже.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((camera) => (
            <CameraCard
              key={camera.name}
              name={camera.name}
              description={camera.description}
              streamUrl={camera.streamUrl}
            />
          ))}
        </div>
      </div>

      <SocialWidgets variant="floating" />
    </div>
  );
};

export default Cameras;
