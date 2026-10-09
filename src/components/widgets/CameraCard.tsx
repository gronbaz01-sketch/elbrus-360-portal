import { Video, AlertCircle, ExternalLink } from "lucide-react";
import type { CameraInfo } from "@/lib/cameras";

interface CameraCardProps {
  camera: CameraInfo;
}

export const CameraCard = ({ camera }: CameraCardProps) => {
  const { name, description, status, streamUrl, sourceName, sourceUrl } = camera;
  // LIVE показываем только при подтверждённом воспроизведении
  const isLive = status === "live" && !!streamUrl;

  const renderPlaceholder = () => {
    if (status === "source") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground px-4">
          <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm text-center mb-1">
            Трансляция доступна на сайте источника
          </p>
          {sourceName && (
            <p className="text-xs opacity-60 mb-3">Источник: {sourceName}</p>
          )}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Смотреть на сайте источника
            </a>
          )}
        </div>
      );
    }
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground px-4">
        <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-sm text-center">Источник не подключён</p>
        <p className="text-xs opacity-60 mt-1">Ожидается подключение потока</p>
      </div>
    );
  };

  return (
    <div className="camera-card">
      <div className="aspect-video relative bg-gradient-to-br from-mountain-blue/10 to-mountain-blue/5">
        {isLive ? (
          // Стандартный плеер video/iframe
          // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
          <video
            src={streamUrl}
            className="w-full h-full object-cover"
            controls
            playsInline
            muted
          />
        ) : (
          renderPlaceholder()
        )}

        {/* Live indicator — только при подтверждённом потоке */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-white font-medium">LIVE</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Video className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-foreground">{name}</h3>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {sourceName && (
          <p className="text-xs text-muted-foreground/70 mt-1">
            Источник: {sourceName}
          </p>
        )}
      </div>
    </div>
  );
};
