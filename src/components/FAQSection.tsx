const FAQS = [
  {
    q: "Как добраться до Приэльбрусья?",
    a: "Ближайший аэропорт — Минеральные Воды, дальше около 180 км по Баксанскому ущелью через Тырныауз, Былым и Терскол — обычно 3–3,5 часа на машине или трансфере.",
  },
  {
    q: "Сколько стоит жильё в Приэльбрусье?",
    a: "От 1 500 ₽ до 9 500 ₽ за сутки в зависимости от посёлка и типа жилья — отель, апартаменты или гостевой дом.",
  },
  {
    q: "Какие посёлки относятся к Приэльбрусью?",
    a: "Терскол, поляна Азау, поляна Чегет, Байдаево, а также Тырныауз, посёлок Эльбрус и посёлок Былым в Баксанском ущелье.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="section-title mb-10 text-center">Частые вопросы</h2>
        <div className="space-y-4">
          {FAQS.map((item) => (
            <div key={item.q} className="glass-card p-6">
              <h3 className="font-semibold text-primary mb-2">{item.q}</h3>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
