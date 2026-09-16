// API'lerin döndürdüğü TargetPage değerlerinin uygulama route'larına eşlenmesi.
import dayjs from "dayjs";
import { BOOLEAN_KEYS, DATE_KEYS, ID_LIST_KEYS, NUMBER_KEYS, TEXT_KEYS } from "../../../utils/dashboardFilterParams";

const TARGET_PAGE_ROUTES = {
  "is-talebi": "/isTalepleri",
  "is-emri": "/isEmri1",
  stok: "/malzemeTanimi",
  // Periyodik bakim tiklamalari artik tanim ekranina degil otomatik is emirleri listesine gider
  // (rehber madde 1): GetPBakimFullList makine sablonu secim modali icindir, is emri listesi degildir.
  "otomatik-is-emirleri": "/otomatikIsEmirleri",
  "bakim-takvimi": "/planlamaTakvimi",
  makine: "/makine",
};

/**
 * Hedef listelerin rehber dökümanına göre kabul ettiği dashboard üst filtreleri.
 * Dökümanda karşılığı olmayan bir filtreyi göndermek hem gereksiz hem yanıltıcı olur:
 * stok listesi lokasyon/ekipman/tarih almıyor; makine ve otomatik iş emirleri listeleri tarih almıyor.
 */
const HEDEF_GLOBAL_DESTEGI = {
  "is-talebi": { ekipmanKirilimi: true, tarih: true },
  "is-emri": { ekipmanKirilimi: true, tarih: true },
  makine: { ekipmanKirilimi: true, tarih: false },
  // Otomatik is emirleri listesi lokasyon/atolye/ekipman kirilimini kabul ediyor.
  // Tarih araligi gonderilmez: rehberdeki govde yalnizca "durum" tasiyor ve backend
  // taninan bir durum geldiginde tarih araligini zaten yok sayiyor.
  "otomatik-is-emirleri": { ekipmanKirilimi: true, tarih: false },
  stok: { ekipmanKirilimi: false, tarih: false },
};

// Hatırlatıcılar ayrı bir sayfa değil; zil ikonundaki popover ya da ayarlardan
// açıldıysa sabitlenmiş yan panel üzerinden gösterilir.
//
// Sabitlenmiş panelin açık/kapalı durumu bir kullanıcı tercihidir, localStorage'da saklanır.
// Popover ise saklanmaz: kalıcı bayrak yazılsaydı bayrağı kimse temizlemediği için
// dashboard'a her dönüşte hatırlatıcı ekranı kendiliğinden açılırdı. Bu yüzden popover
// isteği tek seferlik bir olay olarak yayınlanır.
const openHatirlaticiPanel = () => {
  if (localStorage.getItem("hatirlatici_pinnable") === "true") {
    localStorage.setItem("hatirlatici_panel_open", "true");
    window.dispatchEvent(new Event("hatirlatici_panel_open_changed"));
    return;
  }

  window.dispatchEvent(new Event("hatirlatici_panel_ac"));
};

// Widget'lardan ve API'den gelen eski/kısa alan adlarının liste API'lerindeki karşılıkları.
export const FIELD_ALIASES = {
  // GetDashboardV2Cards "durumIds" dondururken hedef GetIsTalepFullList "durumlar" bekliyor.
  durumids: "durumlar",
  // Ariza is emirleri; rehberde geriye donuk uyumluluk icin de tanimli.
  tipgrup: "prosedurtipleri",
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

/**
 * Bazı widget'lar dönemi tarih aralığı yerine ay numarası (`ay`) ya da periyot indeksi
 * (`periyot` + `gorunum`) olarak döndürüyor. Hedef listeler tarih aralığı beklediği için
 * anlamı kesin olanlar (ay, aylık periyot) aralığa çevrilir; alanın kendisi de korunur.
 */
const donemiTariheCevir = (merged, yil) => {
  const ay = Number(merged.ay ?? (String(merged.gorunum || "").toLowerCase().startsWith("ay") ? merged.periyot : undefined));
  if (!Number.isInteger(ay) || ay < 1 || ay > 12) return;

  const baslangic = dayjs(`${yil}-${String(ay).padStart(2, "0")}-01`);
  if (!baslangic.isValid()) return;

  merged.startDate = baslangic.format("YYYY-MM-DD");
  merged.endDate = baslangic.endOf("month").format("YYYY-MM-DD");
};

/** "2026-01-01T00:00:00" -> "2026-01-01" (liste API'leri gün bazlı bekliyor). */
const toGunFormati = (value) => (value ? String(value).split("T")[0] : null);

/**
 * Aynı alan adı hedefe göre farklı anlama gelebiliyor:
 * iş emri tipi performansında `tipId` iş emri tipini, envanter dağılımında makine tipini ifade ediyor.
 */
export const HEDEFE_OZEL_ALAN_ADLARI = {
  "is-emri": { tipid: "isemritipleri" },
  makine: { tipid: "makinetip" },
};

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
const normalizeFilterParams = (filterParams, targetPage) => {
  const hedefeOzel = HEDEFE_OZEL_ALAN_ADLARI[targetPage] || {};
  const normalized = {};

  const assign = (key, value) => {
    if (value === null || value === undefined || value === "") return;

    const field = hedefeOzel[String(key).toLowerCase()] || resolveFieldName(key);
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
  const merged = normalizeFilterParams(filterParams, targetPage);

  // Makine sayfasına belirli bir ekipmanı açmak için gidiliyorsa (rehber madde 17) üst filtre eklenmez;
  // lokasyon/atölye kısıtı o kaydı listeden düşürebilir. Tip kırılımına gidişte (madde 23-25) eklenir.
  const belirliEkipmanaGidis = targetPage === "makine" && Boolean(merged.makineler?.length);

  const destek = HEDEF_GLOBAL_DESTEGI[targetPage] || {};
  const ekipmanKirilimiDesteklenir = Boolean(destek.ekipmanKirilimi);

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

  // Ay/periyot bilgisi tarih aralığına çevrilir (widget kendi dönemini vermiş sayılır).
  if (!merged.startDate && !merged.endDate) {
    const yil = dayjs(globalFilters?.BaslangicTarihi || undefined).year();
    donemiTariheCevir(merged, yil);
  }

  // Tarih aralığı: widget kendi dönemini verdiyse (ör. Mart çubuğu) o kazanır,
  // vermediyse dashboard üst barındaki tarih aralığı taşınır.
  // Anlık/birikmiş veri gösteren widget'lar (KPI kartları, aksiyon merkezi, envanter) tarih aralığı
  // uygulanmasını istemez; onlar tarihAraligiUygula=false geçer, aksi halde liste sayısı karttan düşük çıkar.
  // Belirli bir kaydı açmaya giderken tarih kısıtı da o kaydı listeden düşürebilir.
  const tarihAraligiUygula = options?.tarihAraligiUygula !== false && !belirliEkipmanaGidis && Boolean(destek.tarih);
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

/**
 * Hedef ekranın URL'sini üretir; yan etkisi yoktur.
 * Yönlendirme yapmadan yalnızca sonucu görmek isteyenler (kapsama denetimi, uyum testi)
 * bunu kullanmalıdır — navigateToTarget çağrılsaydı hatırlatıcı paneli de açılırdı.
 * Yönlendirme yerine panel açan hedefler için null döner.
 */
export const buildTargetUrl = (targetPage, filterParams, globalFilters, options) => {
  const route = TARGET_PAGE_ROUTES[targetPage];
  if (!route) return null;

  const search = buildSearchParams(targetPage, filterParams, globalFilters, options);
  return search ? `${route}?${search}` : route;
};

export const navigateToTarget = (navigate, targetPage, filterParams, globalFilters, options) => {
  if (targetPage === "hatirlatici") {
    openHatirlaticiPanel();
    return;
  }

  const url = buildTargetUrl(targetPage, filterParams, globalFilters, options);
  if (url) navigate(url);
};
