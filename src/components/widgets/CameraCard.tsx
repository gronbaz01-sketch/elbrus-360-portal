import { Video, AlertCircle } from "lucide-react";

interface CameraCardProps {
  name: string;
  description?: string;
  streamUrl?: string;
}

export const CameraCard = ({ name, description, streamUrl }: CameraCardProps) => {
  // Placeholder - ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  const hasStream = streamUrl && streamUrl.length > 0;

  return (
    <div className="camera-card">
      <div className="aspect-video relative bg-gradient-to-br from-mountain-blue/10 to-mountain-blue/5">
        {hasStream ? (
          // Используем стандартный плеер video или iframe
          // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
          <video
            src={streamUrl}
            className="w-full h-full object-cover"
            controls
            playsInline
            muted
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm text-center px-4">
              Камера временно недоступна
            </p>
            <p className="text-xs opacity-60 mt-1">
              {/* ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ */}
              Ожидается подключение потока
            </p>
          </div>
        )}
        
        {/* Live indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-white font-medium">LIVE</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Video className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-foreground">{name}</h3>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};
