// Единый список камер Приэльбрусья.
// Используется на странице /cameras и в виджете на главной.
//
// Правила:
// - live: поток подтверждён и встраивается (показываем LIVE и плеер)
// - source: источник подтверждён, но встраивание запрещено источником
//   (показываем кнопку «Смотреть на сайте источника»)
// - offline: источник не подключён
//
// ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ — в поле streamUrl,
// когда источник предоставит разрешённый публичный поток.

export type CameraStatus = "live" | "source" | "offline";

export interface CameraInfo {
  id: string;
  name: string;
  description: string;
  status: CameraStatus;
  streamUrl?: string; // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  sourceName?: string;
  sourceUrl?: string;
}

export const cameras: CameraInfo[] = [
  {
    id: "azau-vykat",
    name: "Поляна Азау — выкат трасс",
    description: "Выкат трасс у поляны Азау, высота 2350 м",
    status: "source",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
    sourceName: "resort-elbrus.ru",
    sourceUrl: "https://resort-elbrus.ru/webcams",
  },
  {
    id: "mir-south",
    name: "Станция Мир — вид на юг",
    description: "Панорама со станции «Мир», высота 3500 м",
    status: "source",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
    sourceName: "resort-elbrus.ru",
    sourceUrl: "https://resort-elbrus.ru/webcams",
  },
  {
    id: "garabashi-start",
    name: "Гарабаши — старт трассы",
    description: "Станция «Гарабаши», старт трассы, 3847 м",
    status: "source",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
    sourceName: "resort-elbrus.ru",
    sourceUrl: "https://resort-elbrus.ru/webcams",
  },
  {
    id: "garabashi-elbrus",
    name: "Гарабаши — вид на Эльбрус",
    description: "Станция «Гарабаши», вид на Эльбрус, 3847 м",
    status: "source",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
    sourceName: "resort-elbrus.ru",
    sourceUrl: "https://resort-elbrus.ru/webcams",
  },
  {
    id: "cheget-kogutai",
    name: "Поляна Чегет — кафе «Когутай»",
    description: "Камера у кафе «Когутай» на поляне Чегет",
    status: "source",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
    sourceName: "prielbrusie-ski.ru",
    sourceUrl: "https://prielbrusie-ski.ru/webcams/",
  },
  {
    id: "terskol-center",
    name: "Терскол центр",
    description: "Центральная площадь посёлка Терскол",
    status: "offline",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  },
  {
    id: "cheget-3",
    name: "Чегет-3",
    description: "Вершина горы Чегет, 3050 м",
    status: "offline",
    streamUrl: "", // ВСТАВИТЬ ПРЯМУЮ ССЫЛКУ HLS/MP4 ЗДЕСЬ
  },
];
