interface Announcement {
  emoji: string;
  title: string;
  link: string;
}

// Редактируйте свободно: меняйте emoji/title/link, добавляйте или убирайте слоты —
// сетка подстроится сама. link может вести на якорь сайта (#budget) или на внешний URL.
const ANNOUNCEMENTS: Announcement[] = [
  { emoji: "🏔️", title: "Скидка 10% на трансфер", link: "#budget" },
  { emoji: "🍽️", title: "Новое кафе на Чегете", link: "/cafes" },
  { emoji: "📷", title: "Добавлена камера на Гара-Баши", link: "#cameras" },
  { emoji: "🚕", title: "Ночной трансфер без наценки", link: "/taxi" },
  { emoji: "🏠", title: "Горящее предложение на Азау", link: "/apartments" },
  {
    emoji: "📣",
    title: "Разместить объявление здесь",
    link: "https://wa.me/79287150571?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%A5%D0%BE%D1%87%D1%83%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D1%8C%20%D1%81%D0%B2%D0%BE%D1%91%20%D0%BE%D0%B1%D1%8A%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5.",
  },
];

export const AnnouncementsStrip = () => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
      {ANNOUNCEMENTS.map((item) => {
        const external = /^https?:\/\//.test(item.link);
        return (
          <a
            key={item.title}
            href={item.link}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="bg-white/12 hover:bg-white/22 backdrop-blur-md border border-white/20 rounded-xl p-2 md:p-3 text-center transition-colors flex flex-col items-center justify-center gap-1"
          >
            <span className="text-lg md:text-xl">{item.emoji}</span>
            <span className="text-white text-[10px] md:text-xs leading-tight line-clamp-2">
              {item.title}
            </span>
          </a>
        );
      })}
    </div>
  );
};
