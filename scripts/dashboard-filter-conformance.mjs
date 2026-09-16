/* eslint-env node */
/**
 * Dashboard V2 — Tıklama & Hedef Liste İstekleri conformance testi.
 *
 * Rehber dökümanındaki 27 tıklama noktasının her biri için:
 *   1. Dashboard'un buildTargetUrl'i ile URL üretilir,
 *   2. Hedef ekranın URL'den okuduğu filtreler çözülür,
 *   3. O ekranın kodunun gerçekte atacağı istek (endpoint + query + body) modellenir,
 *   4. Dökümandaki beklenen istekle satır satır karşılaştırılır.
 *
 * Çalıştırma:  node scripts/dashboard-filter-conformance.mjs
 */

import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/* ------------------------------------------------------------------ *
 * Uygulama modüllerini node'da çalıştırılabilir hale getir
 * ------------------------------------------------------------------ */

// Test yalnızca saf fonksiyonları çağırıyor; React ve router hook'ları hiç çalışmıyor.
// Bu yüzden ikisini de sanal stub ile değiştiriyoruz, böylece node'da bundle çalışabiliyor.
const stubReactPlugin = {
  name: "stub-react",
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^(react|react-router-dom)$/ }, (args) => ({
      path: args.path,
      namespace: "stub",
    }));

    pluginBuild.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
      contents: `
        export const useMemo = (factory) => factory();
        export const useLocation = () => ({ pathname: "", search: "" });
      `,
      loader: "js",
    }));
  },
};

async function loadAppModules() {
  const outDir = await mkdtemp(join(tmpdir(), "pbt-conformance-"));
  const outfile = join(outDir, "bundle.mjs");

  await build({
    plugins: [stubReactPlugin],
    stdin: {
      contents: `
        export { buildTargetUrl, isNavigableTarget } from "./src/pages/Dashboard1/components/navigation.js";
        export { readDashboardFilterParams, mergeDashboardFilters } from "./src/utils/dashboardFilterParams.js";
      `,
      resolveDir: process.cwd(),
      sourcefile: "conformance-entry.js",
    },
    bundle: true,
    format: "esm",
    platform: "node",
    outfile,
    logLevel: "error",
  });

  const mod = await import(pathToFileURL(outfile).href);
  await rm(outDir, { recursive: true, force: true });
  return mod;
}

/* ------------------------------------------------------------------ *
 * Dökümandaki örnek senaryo: Lokasyon [1,5], Atölye [3], Ekipman [101]
 * ------------------------------------------------------------------ */

const DASHBOARD_FILTERS = {
  BaslangicTarihi: "2026-01-01T00:00:00",
  BitisTarihi: "2026-12-31T23:59:59",
  LokasyonIds: [1, 5],
  AtolyeIds: [3],
  EkipmanIds: [101],
};

/* ------------------------------------------------------------------ *
 * Hedef ekranların gerçek istek kurgusu (kod ile birebir aynı olmalı)
 * ------------------------------------------------------------------ */

// IsEmri/Table/Table.jsx — Filters.jsx mount anında bu boş nesneyi gönderiyor.
const IS_EMRI_MOUNT_FILTERS = { lokasyonlar: {}, isemritipleri: {}, durumlar: {}, customfilter: {} };
const IS_TALEP_MOUNT_FILTERS = { lokasyonlar: {}, isemritipleri: {}, durumlar: {}, onayDurumlari: {}, customfilters: {} };

const SCREEN_MODELS = {
  // src/pages/BakımVeArizaYonetimi/IsEmri/Table/Table.jsx
  "is-emri": ({ filters, isClose }, merge) => {
    // Ekran /isEmri1 icin tarih araligini tekil "customfilter" anahtarinda alir.
    const { customfilters, ...kalan } = filters;
    const ekranFiltreleri = customfilters ? { ...kalan, customfilter: customfilters } : kalan;
    const merged = merge(IS_EMRI_MOUNT_FILTERS, ekranFiltreleri);
    if (isClose === 0 || isClose === 1) merged.isClose = isClose;

    // splitCloseFilterFromRequest: isClose gövdeden çıkarılıp query'ye taşınıyor.
    const { isClose: bodyIsClose, ...body } = merged;
    const isCloseQuery = bodyIsClose === 0 || bodyIsClose === 1 ? { isClose: bodyIsClose } : {};

    return {
      method: "POST",
      endpoint: "getIsEmriFullList",
      query: { parametre: "", pagingDeger: 1, pageSize: 20, ...isCloseQuery },
      body,
    };
  },

  // src/pages/YardimMasasi/IsTalepleri/Table/Table.jsx
  "is-talebi": ({ filters }, merge) => ({
    method: "POST",
    endpoint: "GetIsTalepFullList",
    query: { parametre: "", pagingDeger: 1, pageSize: 20 },
    body: merge(IS_TALEP_MOUNT_FILTERS, filters),
  }),

  // src/pages/MakineEkipman/MakineTanim/Table/Table.jsx
  makine: ({ filters, isAktif }, merge) => {
    const { atolyeler, ...rest } = filters;
    const normalized = atolyeler?.length ? { ...rest, atolye: atolyeler } : rest;

    return {
      method: "POST",
      endpoint: "GetMakineFullList",
      query: {
        parametre: "",
        pagingDeger: 1,
        pageSize: 20,
        // body.isActive query'ye taşınıyor; URL'de isAktif yoksa ekranın varsayılanı 1.
        isAktif: isAktif === 0 || isAktif === 1 ? isAktif : 1,
      },
      body: merge({}, normalized),
    };
  },

  // src/pages/BakımVeArizaYonetimi/PeriyodikBakimlar1/Table/Table.jsx
  "periyodik-bakim": ({ filters }) => ({
    method: "POST",
    endpoint: "GetPBakimFullList",
    query: { pagingDeger: 1, pageSize: 10, parametre: "" },
    body: filters,
  }),

  // src/pages/Malzeme&DepoYonetimi/MalzemeTanimlari/Table/Table.jsx
  stok: ({ isAktif }) => ({
    method: "GET",
    endpoint: "Stok",
    query: {
      modulNo: 1,
      pagingDeger: 1,
      pageSize: 10,
      prm: "",
      isAktif: isAktif === 0 || isAktif === 1 ? isAktif : 1,
    },
    body: null,
  }),
};

/* ------------------------------------------------------------------ *
 * Dökümanın 27 maddesi
 * ------------------------------------------------------------------ */

const MARCH = { startDate: "2026-03-01", endDate: "2026-03-31" };

// Dashboard ust barindaki tarih filtresi. Dokumanda yazmiyor, kullanici talebi uzerine
// tarih bazli widget'larda hedef ekrana tasiniyor.
const DASHBOARD_TARIH = { startDate: "2026-01-01", endDate: "2026-12-31" };

// Anlik/birikmis veri gosteren widget'lar (KPI kartlari, aksiyon merkezi, envanter,
// yaklasan bakimlar, performans ozeti) dashboard tarih araligini uygulamaz.
const ANLIK = { tarihAraligiUygula: false };

const DOC_CASES = [
  // --- BÖLÜM 1: Üst 4 KPI kartı
  { no: 1, options: ANLIK, bolum: "1 · KPI Kartları", baslik: "Bekleyen İş Talepleri", target: "is-talebi",
    widget: { durumlar: [0, 1] },
    expect: { endpoint: "GetIsTalepFullList", pageSize: 10,
      body: { durumlar: [0, 1], lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  { no: 2, options: ANLIK, bolum: "1 · KPI Kartları", baslik: "Açık İş Emirleri", target: "is-emri",
    widget: { isClose: 0 },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { isClose: 0, lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  { no: 3, options: ANLIK, bolum: "1 · KPI Kartları", baslik: "Kritik Stoklar", target: "stok",
    widget: {},
    expect: { endpoint: "Stok", method: "GET", pageSize: 20, query: { isAktif: 1 },
      body: null,
      eksikSozlesme: "Dökümanda kritik stok seviyesini ifade eden parametre yok." } },

  { no: 4, options: ANLIK, bolum: "1 · KPI Kartları", baslik: "Açık Arıza İş Emirleri", target: "is-emri",
    widget: { isClose: 0, prosedurtipleri: [1] },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { isClose: 0, prosedurtipleri: [1], lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  { no: "4b", options: ANLIK, bolum: "1 · KPI Kartları", baslik: "Açık Arıza (geriye dönük tipGrup)", target: "is-emri",
    widget: { isClose: 0, tipGrup: 1 },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { isClose: 0, prosedurtipleri: [1], lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  // --- BÖLÜM 2: Aksiyon merkezi
  { no: 5, options: ANLIK, bolum: "2 · Aksiyon Merkezi", baslik: "Geciken Periyodik Bakımlar", target: "periyodik-bakim",
    widget: { durum: "geciken" },
    expect: { endpoint: "GetPBakimFullList", pageSize: 10,
      body: { durum: "geciken", lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  { no: 6, options: ANLIK, bolum: "2 · Aksiyon Merkezi", baslik: "Onay Bekleyen İş Talepleri", target: "is-talebi",
    widget: { durumlar: [6] },
    expect: { endpoint: "GetIsTalepFullList", pageSize: 10,
      body: { durumlar: [6], lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  { no: 7, options: ANLIK, bolum: "2 · Aksiyon Merkezi", baslik: "Stokta Olmayan Kritik Malzemeler", target: "stok",
    widget: {},
    expect: { endpoint: "Stok", method: "GET", pageSize: 20, query: { isAktif: 1 },
      body: null,
      eksikSozlesme: "Dökümanda 'stokta olmayan kritik' için parametre yok; kart 3 ile aynı istek." } },

  { no: 8, options: ANLIK, bolum: "2 · Aksiyon Merkezi", baslik: "Kritik Açık Arızalar", target: "is-emri",
    widget: { isClose: 0, prosedurtipleri: [1] },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { isClose: 0, prosedurtipleri: [1], lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  { no: 9, options: ANLIK, bolum: "2 · Aksiyon Merkezi", baslik: "Süresi Geçen Hatırlatıcılar", target: "hatirlatici",
    widget: {}, expect: { panel: true } },

  { no: 10, options: ANLIK, bolum: "2 · Aksiyon Merkezi", baslik: "Duruşu Devam Eden İş Emirleri", target: "is-emri",
    widget: { isClose: 0, durusuDevamEden: true },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { isClose: 0, durusuDevamEden: true, lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  // --- BÖLÜM 3: Tamamlanan iş talepleri / iş emirleri
  { no: 11, bolum: "3 · Tamamlananlar", baslik: "Mart 2026 kapatılan iş emirleri", target: "is-emri",
    widget: { isClose: 1, customfilters: MARCH },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { isClose: 1, customfilter: MARCH, lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  { no: 12, bolum: "3 · Tamamlananlar", baslik: "Mart 2026 tamamlanan iş talepleri", target: "is-talebi",
    widget: { durumlar: [2], customfilters: MARCH },
    expect: { endpoint: "GetIsTalepFullList", pageSize: 10,
      body: { durumlar: [2], customfilters: MARCH, lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  // --- BÖLÜM 4: İş emri tipi performansı
  { no: 13, bolum: "4 · İş Emri Tipi", baslik: "Belirli iş emri tipi", target: "is-emri",
    widget: { isemritipleri: [2] },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { isemritipleri: [2], lokasyonlar: [1, 5], atolyeler: [3], makineler: [101], customfilter: DASHBOARD_TARIH } } },

  // --- BÖLÜM 5: Aylık bakım maliyetleri
  { no: 14, bolum: "5 · Aylık Maliyet", baslik: "Şubat 2026 maliyetli iş emirleri", target: "is-emri",
    widget: { customfilters: { startDate: "2026-02-01", endDate: "2026-02-28" } },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { customfilter: { startDate: "2026-02-01", endDate: "2026-02-28" }, lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  // --- BÖLÜM 6: Pareto
  { no: 15, bolum: "6 · Arıza Pareto", baslik: "Kök nedene göre arızalar", target: "is-emri",
    widget: { prosedurtipleri: [1], nedenler: [14] },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { prosedurtipleri: [1], nedenler: [14], lokasyonlar: [1, 5], atolyeler: [3], makineler: [101], customfilter: DASHBOARD_TARIH } } },

  // --- BÖLÜM 7: En çok arızalanan ekipman
  { no: 16, bolum: "7 · Top Ekipman", baslik: "Ekipmanın arıza iş emirleri", target: "is-emri",
    widget: { prosedurtipleri: [1], makineler: [42] },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { prosedurtipleri: [1], makineler: [42], lokasyonlar: [1, 5], atolyeler: [3], customfilter: DASHBOARD_TARIH } } },

  { no: 17, bolum: "7 · Top Ekipman", baslik: "Ekipmanı makine sayfasında açma", target: "makine",
    widget: { makineler: [42] },
    expect: { endpoint: "GetMakineFullList", pageSize: 10,
      body: { makineler: [42] } } },

  // --- BÖLÜM 8: Tekrarlayan arızalar
  // Widget kendi dönem seçicisini (Son 90 Gün vb.) hedefe taşır; örnekte 01.06-31.08 varsayıldı.
  { no: 18, bolum: "8 · Tekrarlayan Arıza", baslik: "Tekrarlayan arızanın iş emirleri", target: "is-emri",
    widget: { prosedurtipleri: [1], makineler: [18], nedenler: [7], startDate: "2026-06-18", endDate: "2026-09-16" },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { prosedurtipleri: [1], makineler: [18], nedenler: [7], lokasyonlar: [1, 5], atolyeler: [3],
        customfilter: { startDate: "2026-06-18", endDate: "2026-09-16" } } } },

  { no: "18b", bolum: "8 · Tekrarlayan Arıza", baslik: "Tekrarlayan arıza (widget'ın eski alan adları)", target: "is-emri",
    widget: { makineId: 18, nedenId: 7, tipGrup: 1, startDate: "2026-06-18", endDate: "2026-09-16" },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { prosedurtipleri: [1], makineler: [18], nedenler: [7], lokasyonlar: [1, 5], atolyeler: [3],
        customfilter: { startDate: "2026-06-18", endDate: "2026-09-16" } } } },

  // --- BÖLÜM 9: Yaklaşan periyodik bakımlar
  { no: 19, options: ANLIK, bolum: "9 · Yaklaşan Bakım", baslik: "Yaklaşan bakım satırı", target: "periyodik-bakim",
    widget: { makineler: [25] },
    expect: { endpoint: "GetPBakimFullList", pageSize: 10,
      body: { makineler: [25], lokasyonlar: [1, 5], atolyeler: [3] } } },

  { no: 20, options: ANLIK, bolum: "9 · Yaklaşan Bakım", baslik: "Bakım takvimini aç", target: "bakim-takvimi",
    widget: {}, expect: { navigateOnly: true } },

  // --- BÖLÜM 10: Personel KPI
  // Widget kendi dönem seçicisini (Bu Ay vb.) hedefe taşır; örnekte Eylül 2026 varsayıldı.
  { no: 21, bolum: "10 · Personel KPI", baslik: "Teknisyene atanmış iş emirleri", target: "is-emri",
    widget: { personeller: [12], startDate: "2026-09-01", endDate: "2026-09-30" },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { personeller: [12], lokasyonlar: [1, 5], atolyeler: [3], makineler: [101],
        customfilter: { startDate: "2026-09-01", endDate: "2026-09-30" } } } },

  // --- BÖLÜM 11: Süre dağılımı
  { no: 22, bolum: "11 · Süre Dağılımı", baslik: "Hafta 12 iş emirleri", target: "is-emri",
    widget: { customfilters: { startDate: "2026-03-16", endDate: "2026-03-22" } },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { customfilter: { startDate: "2026-03-16", endDate: "2026-03-22" }, lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  // --- BÖLÜM 12: Envanter dağılımı
  { no: 23, options: ANLIK, bolum: "12 · Envanter", baslik: "Aktif ekipmanlar", target: "makine",
    widget: { isAktif: 1, makinetip: [5] },
    expect: { endpoint: "GetMakineFullList", pageSize: 10,
      body: { isAktif: 1, makinetip: [5], lokasyonlar: [1, 5], atolye: [3] } } },

  { no: 24, options: ANLIK, bolum: "12 · Envanter", baslik: "Arızalı ekipmanlar", target: "makine",
    widget: { isAktif: 1, arizali: true, makinetip: [5] },
    expect: { endpoint: "GetMakineFullList", pageSize: 10,
      body: { isAktif: 1, arizali: true, makinetip: [5], lokasyonlar: [1, 5], atolye: [3] } } },

  { no: 25, options: ANLIK, bolum: "12 · Envanter", baslik: "Pasif ekipmanlar", target: "makine",
    widget: { isAktif: 0, makinetip: [5] },
    expect: { endpoint: "GetMakineFullList", pageSize: 10,
      body: { isAktif: 0, makinetip: [5], lokasyonlar: [1, 5], atolye: [3] } } },

  // --- BÖLÜM 13: Performans özeti
  { no: 26, options: ANLIK, bolum: "13 · Performans Özeti", baslik: "Geciken periyodik bakım kutusu", target: "periyodik-bakim",
    widget: { durum: "geciken" },
    expect: { endpoint: "GetPBakimFullList", pageSize: 10,
      body: { durum: "geciken", lokasyonlar: [1, 5], atolyeler: [3], makineler: [101] } } },

  { no: 27, options: ANLIK, bolum: "13 · Performans Özeti", baslik: "En yüksek iş yükü ekibi", target: "is-emri",
    widget: { atolyeler: [3], isClose: 0 },
    expect: { endpoint: "GetIsEmriFullList", pageSize: 10,
      body: { atolyeler: [3], isClose: 0, lokasyonlar: [1, 5], makineler: [101] } } },
];

/* ------------------------------------------------------------------ *
 * Karşılaştırma
 * ------------------------------------------------------------------ */

const sameValue = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && [...a].sort().every((value, index) => value === [...b].sort()[index]);
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return a === b;
};

/** Beklenen her alanı, gerçek isteğin gövdesinde veya query'sinde arar. */
function checkField(field, expectedValue, actual) {
  const inBody = actual.body && Object.prototype.hasOwnProperty.call(actual.body, field);
  if (inBody && sameValue(actual.body[field], expectedValue)) {
    return { field, level: "ok", where: "body" };
  }

  const inQuery = Object.prototype.hasOwnProperty.call(actual.query, field);
  if (inQuery && sameValue(actual.query[field], expectedValue)) {
    return { field, level: "transport", where: "query", note: "değer doğru ama gövde yerine query'de gidiyor" };
  }

  const found = inBody ? actual.body[field] : inQuery ? actual.query[field] : undefined;
  return {
    field,
    level: "fail",
    where: inBody ? "body" : inQuery ? "query" : "yok",
    note: found === undefined ? "gönderilmiyor" : `beklenen ${JSON.stringify(expectedValue)}, gelen ${JSON.stringify(found)}`,
  };
}

function runCase(testCase, modules) {
  const { buildTargetUrl, readDashboardFilterParams, mergeDashboardFilters } = modules;

  // Panel hedefleri yönlendirme üretmez; URL üretmeyi hiç denemeden ayrılıyoruz.
  if (testCase.expect.panel) {
    return { ...testCase, url: "(hatırlatıcı paneli açılır)", status: "skip", fields: [], extras: [], notes: ["Liste API'si yok — sağ panel açılıyor."] };
  }

  const url = buildTargetUrl(testCase.target, testCase.widget, DASHBOARD_FILTERS, testCase.options);

  if (url === null) {
    return { ...testCase, url: "(yönlendirme yok)", status: "fail", fields: [], extras: [], notes: ["buildTargetUrl hiçbir route üretmedi."] };
  }

  const search = url.includes("?") ? url.split("?")[1] : "";

  if (testCase.expect.navigateOnly) {
    return { ...testCase, url, status: "skip", fields: [], extras: [], notes: ["Döküman yalnızca yönlendirme tarif ediyor, filtre taşınmıyor."] };
  }

  const parsed = readDashboardFilterParams(search);
  const actual = SCREEN_MODELS[testCase.target](parsed, mergeDashboardFilters);

  const notes = [];
  const fields = [];

  if (testCase.expect.endpoint && actual.endpoint.toLowerCase() !== testCase.expect.endpoint.toLowerCase()) {
    notes.push(`Endpoint farkı: döküman ${testCase.expect.endpoint}, ekran ${actual.endpoint}`);
  }
  // Sayfa boyutu bilerek tasinmiyor: her liste ekrani kendi varsayilaniyla aciliyor (kullanici karari).
  if (testCase.expect.eksikSozlesme) {
    notes.push(testCase.expect.eksikSozlesme);
  }

  Object.entries(testCase.expect.body || {}).forEach(([field, value]) => {
    fields.push(checkField(field, value, actual));
  });
  Object.entries(testCase.expect.query || {}).forEach(([field, value]) => {
    fields.push(checkField(field, value, actual));
  });

  // Dökümanda olmayıp ekranın fazladan gönderdiği anlamlı filtreler.
  const expectedFields = new Set([...Object.keys(testCase.expect.body || {}), ...Object.keys(testCase.expect.query || {})]);
  const extras = Object.entries(actual.body || {})
    .filter(([field, value]) => {
      if (expectedFields.has(field)) return false;
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object") return Object.keys(value).length > 0;
      return true;
    })
    .map(([field, value]) => `${field}=${JSON.stringify(value)}`);

  const hasFail = fields.some((entry) => entry.level === "fail");
  const hasTransport = fields.some((entry) => entry.level === "transport");
  const status = hasFail ? "fail" : hasTransport || notes.length || extras.length ? "warn" : "pass";

  return { ...testCase, url, actual, status, fields, extras, notes };
}

/* ------------------------------------------------------------------ *
 * Rapor
 * ------------------------------------------------------------------ */

const ICON = { pass: "✅", warn: "⚠️ ", fail: "❌", skip: "➖" };

function report(results) {
  let lastBolum = null;

  results.forEach((result) => {
    if (result.bolum !== lastBolum) {
      console.log(`\n[1m── BÖLÜM ${result.bolum}[0m`);
      lastBolum = result.bolum;
    }

    console.log(`\n${ICON[result.status]} ${String(result.no).padStart(3)} · ${result.baslik}  →  ${result.target}`);
    console.log(`      URL   : ${result.url}`);

    if (result.actual) {
      const query = Object.entries(result.actual.query).map(([key, value]) => `${key}=${value}`).join("&");
      console.log(`      İSTEK : ${result.actual.method} ${result.actual.endpoint}?${query}`);
      console.log(`      GÖVDE : ${JSON.stringify(result.actual.body)}`);
    }

    result.fields.forEach((entry) => {
      if (entry.level === "ok") return;
      const mark = entry.level === "fail" ? "❌" : "⚠️ ";
      console.log(`      ${mark} ${entry.field}: ${entry.note}`);
    });

    if (result.extras.length) {
      console.log(`      ℹ️  dökümanda olmayan ek alanlar: ${result.extras.join(", ")}`);
    }
    result.notes.forEach((note) => console.log(`      ℹ️  ${note}`));
  });

  const tally = results.reduce((acc, result) => ({ ...acc, [result.status]: (acc[result.status] || 0) + 1 }), {});

  console.log(`\n${"─".repeat(72)}`);
  console.log(`ÖZET  ✅ tam ${tally.pass || 0}   ⚠️  uyarı ${tally.warn || 0}   ❌ hata ${tally.fail || 0}   ➖ filtresiz ${tally.skip || 0}   (toplam ${results.length})`);
  console.log(`${"─".repeat(72)}\n`);

  return (tally.fail || 0) === 0;
}

/* ------------------------------------------------------------------ */

// Hatırlatıcı hedefi localStorage ve window event'i kullanıyor; node'da minimal karşılık veriyoruz.
globalThis.localStorage = { store: {}, setItem(key, value) { this.store[key] = value; }, getItem(key) { return this.store[key] ?? null; } };
globalThis.window = { dispatchEvent: () => true };
globalThis.Event = class { constructor(type) { this.type = type; } };

const modules = await loadAppModules();
const results = DOC_CASES.map((testCase) => runCase(testCase, modules));
const ok = report(results);

process.exit(ok ? 0 : 1);
