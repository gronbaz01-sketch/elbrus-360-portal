import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Snowflake } from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  wind: number;
  humidity: number;
  feelsLike: number;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: -8,
    condition: "snowy",
    wind: 12,
    humidity: 85,
    feelsLike: -14,
  });

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
        return <Sun className="w-16 h-16 text-sunrise-gold" />;
      case "rainy":
        return <CloudRain className="w-16 h-16 text-blue-300" />;
      case "snowy":
        return <Snowflake className="w-16 h-16 text-white" />;
      default:
        return <Cloud className="w-16 h-16 text-white/80" />;
    }
  };

  const getConditionText = () => {
    switch (weather.condition) {
      case "sunny":
        return "Ясно";
      case "rainy":
        return "Дождь";
      case "snowy":
        return "Снег";
      default:
        return "Облачно";
    }
  };

  return (
    <div className="weather-widget">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold opacity-90">Терскол сейчас</h3>
          <p className="text-sm text-white/60">Высота 2100 м</p>
        </div>
        {getWeatherIcon()}
      </div>

      <div className="flex items-end gap-2 mb-6">
        <span className="text-6xl font-bold">{weather.temperature}°</span>
        <span className="text-2xl text-white/70 pb-2">C</span>
      </div>

      <p className="text-lg mb-6">{getConditionText()}</p>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-1 p-3 bg-white/10 rounded-xl">
          <Thermometer className="w-5 h-5 text-white/70" />
          <span className="text-xs text-white/60">Ощущается</span>
          <span className="font-semibold">{weather.feelsLike}°</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-3 bg-white/10 rounded-xl">
          <Wind className="w-5 h-5 text-white/70" />
          <span className="text-xs text-white/60">Ветер</span>
          <span className="font-semibold">{weather.wind} м/с</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-3 bg-white/10 rounded-xl">
          <Droplets className="w-5 h-5 text-white/70" />
          <span className="text-xs text-white/60">Влажность</span>
          <span className="font-semibold">{weather.humidity}%</span>
        </div>
      </div>
    </div>
  );
};
