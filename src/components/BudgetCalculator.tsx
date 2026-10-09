import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";

interface ApartmentRow {
  id: string;
  title: string;
  location: string;
  location_key: string;
  price: number;
  guests: number | null;
  level: string | null;
}

const LEVEL_LABEL: Record<string, string> = {
  hotel: "Отель",
  apartments: "Апартаменты",
  guesthouse: "Гостевой дом",
};

const WHATSAPP_MANAGER = "79287150571";
const fmt = (n: number) => n.toLocaleString("ru-RU");

export const BudgetCalculator = () => {
  const [apartments, setApartments] = useState<ApartmentRow[]>([]);
  const [budget, setBudget] = useState(50000);
  const [days, setDays] = useState(4);
  const [level, setLevel] = useState<string>("any");
  const [transfer, setTransfer] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("apartments")
        .select("id, title, location, location_key, price, guests, level");
      if (!error && data) setApartments(data as ApartmentRow[]);
    };
    load();
  }, []);

  const transferCost = transfer ? 7000 : 0;
  const perNight = Math.max(0, (budget - transferCost) / days);

  const matches = useMemo(() => {
    return apartments
      .filter((a) => (level === "any" || a.level === level) && a.price <= perNight)
      .sort((a, b) => b.price - a.price);
  }, [apartments, level, perNight]);

  const sendToWhatsApp = () => {
    const text =
      `Здравствуйте! Подбираю поездку в Приэльбрусье.\n` +
      `Бюджет: ${fmt(budget)} ₽\nДней: ${days}\n` +
      `Тип жилья: ${level === "any" ? "любой" : LEVEL_LABEL[level] || level}\n` +
      `Трансфер: ${transfer ? "нужен (≈7000 ₽)" : "не нужен"}\n` +
      `Получается ≈ ${fmt(Math.round(perNight))} ₽/сутки на жильё.\n` +
      `Подскажите подходящие варианты, пожалуйста!`;
    window.open(`https://wa.me/${WHATSAPP_MANAGER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const bookMatch = (a: ApartmentRow) => {
    const text =
      `Здравствуйте! Хочу забронировать: ${a.title} (${a.location}).\n` +
      `Бюджет: ${fmt(budget)} ₽, дней: ${days}, трансфер: ${transfer ? "нужен" : "не нужен"}.`;
    window.open(`https://wa.me/${WHATSAPP_MANAGER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="budget" className="py-20 md:py-28 bg-gradient-mountain text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Калькулятор бюджета поездки
          </h2>
          <p className="text-white/75">
            Двигайте ползунки — мы мгновенно подберём жильё, которое впишется в бюджет.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/15 h-fit">
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Ваш бюджет на жильё и трансфер</label>
                <span className="font-display text-2xl text-accent font-bold">
                  {budget >= 300000 ? "300 000+" : fmt(budget)} ₽
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={300000}
                step={5000}
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>10 000 ₽</span>
                <span>300 000+ ₽</span>
              </div>
            </div>

            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Количество дней</label>
                <span className="font-display text-2xl text-accent font-bold">{days}</span>
              </div>
              <input
                type="range"
                min={1}
                max={14}
                step={1}
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value, 10))}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>1 день</span>
                <span>14 дней</span>
              </div>
            </div>

            <div className="mb-7">
              <p className="font-semibold mb-3">Тип жилья</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "any", label: "Любой" },
                  { value: "hotel", label: "Отели" },
                  { value: "apartments", label: "Апартаменты" },
                  { value: "guesthouse", label: "Гостевые дома" },
                ].map((chip) => (
                  <button
                    key={chip.value}
                    onClick={() => setLevel(chip.value)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      level === chip.value
                        ? "bg-white text-primary"
                        : "bg-white/15 text-white hover:bg-white/25"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={transfer}
                onChange={(e) => setTransfer(e.target.checked)}
                className="w-5 h-5 rounded accent-accent"
              />
              <span className="font-semibold">
                Нужен трансфер из а/п Минводы (≈ 7 000 ₽ туда-обратно)
              </span>
            </label>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 bg-white text-foreground rounded-2xl p-6 md:p-8 shadow-elevated">
            <h3 className="font-display text-xl font-semibold mb-5 text-primary">Ваш расчёт</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Жильё / сутки</p>
                <p className="font-display text-xl font-bold text-primary">
                  {fmt(Math.round(perNight))} ₽
                </p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Трансфер</p>
                <p className="font-display text-xl font-bold text-primary">{fmt(transferCost)} ₽</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Итого на поездку</p>
                <p className="font-display text-xl font-bold text-primary">{fmt(budget)} ₽</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              {matches.length === 0
                ? `На ${fmt(Math.round(perNight))} ₽/сутки подходящего жилья не нашлось. Увеличьте бюджет, уменьшите число дней или отключите трансфер.`
                : `${fmt(Math.round(perNight))} ₽/сутки × ${days} дн. + трансфер ${fmt(transferCost)} ₽ = ${fmt(
                    Math.round(perNight) * days + transferCost
                  )} ₽ (в пределах бюджета ${fmt(budget)} ₽).`}
            </p>

            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-primary">Подходящие варианты жилья</h4>
              {matches.length > 0 && (
                <span className="text-sm text-muted-foreground">найдено: {matches.length}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {matches.map((a) => (
                <div
                  key={a.id}
                  className="border border-border rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.location} · {LEVEL_LABEL[a.level ?? ""] ?? a.level} · до {a.guests ?? 2} гостей
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm">{fmt(a.price)} ₽</p>
                    <button
                      onClick={() => bookMatch(a)}
                      className="text-xs text-primary underline mt-1"
                    >
                      Забронировать
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={sendToWhatsApp}
              className="whatsapp-btn w-full justify-center mt-6 py-3"
            >
              <MessageCircle className="w-4 h-4" />
              Отправить расчёт менеджеру в WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
