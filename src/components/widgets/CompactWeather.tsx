import { useEffect, useState } from "react";

const AZAU_COORDS = { lat: 43.2549, lon: 42.4922 };

function wmoToEmoji(code: number): string {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "⛅";
}

export const CompactWeather = () => {
  const [temp, setTemp] = useState<number | null>(null);
  const [icon, setIcon] = useState("⛅");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${AZAU_COORDS.lat}&longitude=${AZAU_COORDS.lon}&current=temperature_2m,weather_code&timezone=Europe/Moscow`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) {
          setTemp(Math.round(data.current.temperature_2m));
          setIcon(wmoToEmoji(data.current.weather_code));
        }
      } catch {
        // тихо оставляем плейсхолдер, если сеть недоступна
      }
    };

    load();
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-black/45 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/15 flex items-center gap-3 self-start">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-white/70 text-[11px] leading-none mb-1">Поляна Азау сейчас</p>
        <p className="text-white font-display font-bold text-xl leading-none">
          {temp === null ? "—°C" : `${temp > 0 ? "+" : ""}${temp}°C`}
        </p>
      </div>
    </div>
  );
};
