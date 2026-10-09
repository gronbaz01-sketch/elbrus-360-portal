import { useState } from "react";
import { Camera, X } from "lucide-react";

interface CameraItem {
  name: string;
  description: string;
  streamUrl?: string;
}

// Чтобы подключить трансляцию — впишите прямую HLS/MP4-ссылку в streamUrl.
const CAMERAS: CameraItem[] = [
  { name: "Поляна Азау", description: "Подъёмник и начало трасс, высота 2350 м" },
  { name: "Станция Мир", description: "Панорама Эльбруса на высоте 3500 м" },
  { name: "Поляна Чегет", description: "Горнолыжные трассы Чегета" },
  { name: "Терскол, центр", description: "Центральная площадь посёлка" },
  { name: "Гара-Баши", description: "Верхняя станция канатной дороги, 3847 м" },
  { name: "Вершина Чегета", description: "Вид с вершины горы Чегет, 3050 м" },
];

export const HeroCameras = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? CAMERAS[openIndex] : null;

  return (
    <div className="bg-black/45 backdrop-blur-md rounded-2xl p-3 border border-white/15 w-full sm:w-auto sm:max-w-[280px]">
      <p className="text-white text-xs font-semibold flex items-center gap-1.5 mb-2 px-0.5">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Камеры онлайн
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {CAMERAS.map((cam, i) => (
          <button
            key={cam.name}
            onClick={() => setOpenIndex(i)}
            title={cam.name}
            className="relative aspect-square rounded-lg overflow-hidden bg-primary/40 flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Camera className="w-4 h-4 text-white" />
            <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-primary/10 relative flex items-center justify-center">
              {active.streamUrl ? (
                <video
                  src={active.streamUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="text-center px-4 text-muted-foreground">
                  <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Ожидается подключение потока</p>
                </div>
              )}
            </div>
            <div className="p-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold">{active.name}</h3>
                <p className="text-sm text-muted-foreground">{active.description}</p>
              </div>
              <button
                onClick={() => setOpenIndex(null)}
                className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
