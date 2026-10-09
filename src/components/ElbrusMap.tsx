export const ElbrusMap = () => {
  const src =
    "https://yandex.ru/map-widget/v1/?ll=42.72%2C43.33&z=10&l=map&pt=" +
    "42.9186%2C43.4014%2Cpm2vim~" +
    "42.9928%2C43.4667%2Cpm2ltm~" +
    "42.6863%2C43.3167%2Cpm2lbm~" +
    "42.5487%2C43.2926%2Cpm2orm~" +
    "42.4993%2C43.2649%2Cpm2rdm~" +
    "42.4914%2C43.2549%2Cpm2blm~" +
    "42.4844%2C43.2461%2Cpm2grm";

  return (
    <section id="map" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="section-title mb-4">Карта Приэльбрусья</h2>
          <p className="text-muted-foreground max-w-2xl">
            Все посёлки на одной карте — от Тырныауза до поляны Азау и Чегета. Кликните по метке,
            чтобы увидеть название.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-elevated border border-border">
          <iframe
            src={src}
            width="100%"
            height="480"
            frameBorder="0"
            title="Карта Приэльбрусья"
            style={{ position: "relative" }}
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-muted-foreground">
          <span>🟣 Тырныауз</span>
          <span>🟤 Былым</span>
          <span>🔵 п. Эльбрус</span>
          <span>🟠 Байдаево</span>
          <span>🔴 Терскол</span>
          <span>🔷 Азау</span>
          <span>🟢 Чегет</span>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-4">
          Метки расставлены приблизительно по центрам населённых пунктов.
        </p>
      </div>
    </section>
  );
};
