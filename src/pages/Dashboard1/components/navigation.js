// API'lerin döndürdüğü TargetPage değerlerinin uygulama route'larına eşlenmesi.
import { BOOLEAN_KEYS, DATE_KEYS, ID_LIST_KEYS, NUMBER_KEYS, TEXT_KEYS } from "../../../utils/dashboardFilterParams";

const TARGET_PAGE_ROUTES = {
  "is-talebi": "/isTalepleri",
  "is-emri": "/isEmri1",
  stok: "/malzemeTanimi",
  "periyodik-bakim": "/periyodikBakimlar",
  "bakim-takvimi": "/planlamaTakvimi",
  makine: "/makine",
};

// Hatırlatıcılar ayrı bir sayfa değil, sağdaki panel üzerinden açılır.
const openHatirlaticiPanel = () => {
  localStorage.setItem("hatirlatici_panel_open", "true");
  window.dispatchEvent(new Event("hatirlatici_panel_open_changed"));
};

// Widget'lardan ve API'den gelen eski/kısa alan adlarının liste API'lerindeki karşılıkları.
const FIELD_ALIASES = {
  // GetDashboardV2Cards "durumIds" dondururken hedef GetIsTalepFullList "durumlar" bekliyor.
  durumids: "durumlar",
  makineid: "makineler",
  makineids: "makineler",
  ekipmanid: "makineler",
  ekipmanids: "makineler",
  lokasyonid: "lokasyonlar",
  lokasyonids: "lokasyonlar",
  atolye: "atolyeler",
  atolyeid: "atolyeler",
  atolyeids: "atolyeler",
  nedenid: "nedenler",
  nedenids: "nedenler",
  nedenkodid: "nedenler",
  personelid: "personeller",
  personelids: "personeller",
  makinetipid: "makinetip",
  makinetipids: "makinetip",
  makinetipleri: "makinetip",
  isemritipid: "isemritipleri",
  isemritipids: "isemritipleri",
  kategoriid: "kategori",
  kategoriids: "kategori",
  onaydurumlar: "onaydurumlari",
  baslangictarihi: "startDate",
  bitistarihi: "endDate",
};

/** "2026-01-01T00:00:00" -> "2026-01-01" (liste API'leri gün bazlı bekliyor). */
const toGunFormati = (value) => (value ? String(value).split("T")[0] : null);

const ARRAY_TARGET_KEYS = new Set(ID_LIST_KEYS);
const DATE_TARGET_KEYS = new Set(DATE_KEYS);
const SCALAR_TARGET_KEYS = new Set([...BOOLEAN_KEYS, ...DATE_KEYS, ...NUMBER_KEYS, ...TEXT_KEYS]);

/**
 * Farklı adlarla gelebilen filtre alanlarını liste API'lerinin beklediği tek isme indirger.
 * Tanınmayan alanlar DÜŞÜRÜLMEZ; Dashboard API'si ileride yeni bir filtre döndürürse
 * hedef ekrana olduğu gibi taşınsın diye kendi adıyla aktarılır.
 */
const resolveFieldName = (key) => {
  const normalized = String(key).toLowerCase();
  if (FIELD_ALIASES[normalized]) return FIELD_ALIASES[normalized];

  const canonical = [...ARRAY_TARGET_KEYS, ...SCALAR_TARGET_KEYS].find((candidate) => candidate.toLowerCase() === normalized);
  return canonical || String(key);
};

/** Tekil ID, ID dizisi veya virgüllü metin olarak gelen değeri ID dizisine çevirir. */
const toIdList = (value) => {
  const rawValues = Array.isArray(value) ? value : String(value).split(",");

  return rawValues.map((item) => Number(String(item).trim())).filter((item) => Number.isFinite(item));
};

/** Widget filtrelerini liste API'si sözlüğüne çevirip düz bir nesneye toplar. */
const normalizeFilterParams = (filterParams) => {
  const normalized = {};

  const assign = (key, value) => {
    if (value === null || value === undefined || value === "") return;

    // Arıza iş emirleri geriye dönük olarak tipGrup ile geliyor; karşılığı prosedurtipleri listesidir.
    if (String(key).toLowerCase() === "tipgrup") {
      const ids = toIdList(value);
      if (ids.length) normalized.prosedurtipleri = ids;
      return;
    }

    const field = resolveFieldName(key);
    if (!field) return;

    if (ARRAY_TARGET_KEYS.has(field)) {
      const ids = toIdList(value);
      if (ids.length) normalized[field] = ids;
      return;
    }

    // Widget'tan saatli tarih gelebiliyor; hedef listeler gün bazlı bekliyor.
    if (DATE_TARGET_KEYS.has(field)) {
      normalized[field] = toGunFormati(value);
      return;
    }

    normalized[field] = value;
  };

  Object.entries(filterParams || {}).forEach(([key, value]) => {
    // customfilters/customfilter içindeki tarihler bir seviye yukarı taşınır.
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => assign(nestedKey, nestedValue));
      return;
    }

    assign(key, value);
  });

  return normalized;
};

/** Dashboard üst filtrelerini widget filtreleriyle birleştirip query string üretir. */
const buildSearchParams = (targetPage, filterParams, globalFilters, options) => {
  const merged = normalizeFilterParams(filterParams);

  // Makine sayfasına belirli bir ekipmanı açmak için gidiliyorsa (rehber madde 17) üst filtre eklenmez;
  // lokasyon/atölye kısıtı o kaydı listeden düşürebilir. Tip kırılımına gidişte (madde 23-25) eklenir.
  const belirliEkipmanaGidis = targetPage === "makine" && Boolean(merged.makineler?.length);

  const ekipmanKirilimiDesteklenir = true;

  // Widget kendi ekipman/lokasyon kırılımını verdiyse o korunur, aksi halde üst filtre uygulanır.
  const ustFiltreEklenir = !belirliEkipmanaGidis && ekipmanKirilimiDesteklenir;

  if (ustFiltreEklenir && !merged.lokasyonlar?.length && globalFilters?.LokasyonIds?.length) {
    merged.lokasyonlar = globalFilters.LokasyonIds;
  }
  if (ustFiltreEklenir && !merged.atolyeler?.length && globalFilters?.AtolyeIds?.length) {
    merged.atolyeler = globalFilters.AtolyeIds;
  }
  if (ekipmanKirilimiDesteklenir && !merged.makineler?.length && globalFilters?.EkipmanIds?.length) {
    merged.makineler = globalFilters.EkipmanIds;
  }

  // Tarih aralığı: widget kendi dönemini verdiyse (ör. Mart çubuğu) o kazanır,
  // vermediyse dashboard üst barındaki tarih aralığı taşınır.
  // Anlık/birikmiş veri gösteren widget'lar (KPI kartları, aksiyon merkezi, envanter) tarih aralığı
  // uygulanmasını istemez; onlar tarihAraligiUygula=false geçer, aksi halde liste sayısı karttan düşük çıkar.
  // Belirli bir kaydı açmaya giderken tarih kısıtı da o kaydı listeden düşürebilir.
  const tarihAraligiUygula = options?.tarihAraligiUygula !== false && !belirliEkipmanaGidis;
  if (tarihAraligiUygula && !merged.startDate && !merged.endDate) {
    const baslangic = toGunFormati(globalFilters?.BaslangicTarihi);
    const bitis = toGunFormati(globalFilters?.BitisTarihi);
    if (baslangic) merged.startDate = baslangic;
    if (bitis) merged.endDate = bitis;
  }

  const params = new URLSearchParams();

  Object.entries(merged).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    params.set(key, Array.isArray(value) ? value.join(",") : String(value));
  });

  // Sayfa boyutu hedefe taşınmaz; her liste ekranı kendi varsayılanıyla açılır.

  return params.toString();
};

export const isNavigableTarget = (targetPage) => targetPage === "hatirlatici" || Boolean(TARGET_PAGE_ROUTES[targetPage]);

export const navigateToTarget = (navigate, targetPage, filterParams, globalFilters, options) => {
  if (targetPage === "hatirlatici") {
    openHatirlaticiPanel();
    return;
  }

  const route = TARGET_PAGE_ROUTES[targetPage];
  if (!route) return;

  const search = buildSearchParams(targetPage, filterParams, globalFilters, options);
  navigate(search ? `${route}?${search}` : route);
};
