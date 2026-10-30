/** Hizli sekmeler ve KPI kartlari; `deger` istekteki `connectionStatus`, `kpiAlani` yanittaki `kpi` alanidir. */
export const BAGLANTI_SEKMELERI = [
  { deger: "ALL", labelKey: "altEkipmanVeritabani.sekme.tumu", kpiLabelKey: "altEkipmanVeritabani.kpi.toplam", kpiAlani: "totalCount", ikon: "toplam" },
  { deger: "STOK", labelKey: "altEkipmanVeritabani.sekme.stokta", kpiLabelKey: "altEkipmanVeritabani.sekme.stokta", kpiAlani: "inStockCount", ikon: "stok" },
  { deger: "BAGLI", labelKey: "altEkipmanVeritabani.sekme.bagli", kpiLabelKey: "altEkipmanVeritabani.sekme.bagli", kpiAlani: "connectedCount", ikon: "bagli" },
  { deger: "HURDA", labelKey: "altEkipmanVeritabani.sekme.hurda", kpiLabelKey: "altEkipmanVeritabani.sekme.hurda", kpiAlani: "scrapCount", ikon: "hurda" },
];

/** Baglanti durumu rozeti (`connectionStatusCode`). */
export const BAGLANTI_ROZETLERI = {
  BAGLI: { renk: "blue", labelKey: "altEkipmanVeritabani.baglanti.bagli" },
  STOK: { renk: "default", labelKey: "altEkipmanVeritabani.baglanti.stok" },
  HURDA: { renk: "red", labelKey: "altEkipmanVeritabani.baglanti.hurda" },
};

/** Ekipman durumu metni kod listesinden gelir; rengi bilinen adlara gore secilir. */
export const DURUM_RENKLERI = { aktif: "green", bakımda: "orange", bakimda: "orange", pasif: "default", hurda: "red" };

/** Global filtre seciciler icin KodList gruplari (mevcut ekleme formuyla ayni). */
export const KOD_GRUPLARI = { ekipmanTipi: 32601, ekipmanDurumu: 32606 };

export const SAYFA_BOYUTLARI = [10, 20, 50, 100];
export const VARSAYILAN_SAYFA_BOYUTU = 20;

/** Dokumandaki tek siralama alani; tasarimdaki diger kolon siralamalari icin API alan adlari belirtilmemis. */
export const SIRALAMA_ALANI = "kod";

/**
 * Tablo kolonlari (varsayilan sira); sira, gorunurluk ve genislik "Sütunları Yönet" ile degisir. Ilk dokuzu tasarimin
 * kolonlaridir, digerleri API'nin dondurdugu (eski tablodaki) alanlardir ve varsayilan olarak gizlidir.
 * - `alan`: satirdaki veri alani; `tur`: ozel hucre (yoksa duz metin).
 * - `agacta: false`: agac gorunumunde cizilmez; orada kod ve tanim ilk kolonda birlesir, ust ekipman agacin kendisidir.
 */
export const KOLONLAR = [
  { key: "code", labelKey: "altEkipmanVeritabani.kolon.ekipmanNo", alan: "code", tur: "kod", genislik: 170, agacta: false },
  { key: "name", labelKey: "altEkipmanVeritabani.kolon.tanim", alan: "name", tur: "kalin", genislik: 200, agacta: false },
  { key: "type", labelKey: "altEkipmanVeritabani.kolon.ekipmanTipi", alan: "equipmentType", genislik: 130 },
  { key: "serial", labelKey: "altEkipmanVeritabani.kolon.seriNo", alan: "serialNo", genislik: 110 },
  { key: "parent", labelKey: "altEkipmanVeritabani.kolon.bagliOlduguEkipman", alan: "parentPath", genislik: 280, agacta: false },
  { key: "location", labelKey: "altEkipmanVeritabani.kolon.konumDepo", alan: "locationOrWarehouse", genislik: 140 },
  { key: "connection", labelKey: "altEkipmanVeritabani.kolon.baglantiDurumu", tur: "baglanti", genislik: 140 },
  { key: "status", labelKey: "altEkipmanVeritabani.kolon.ekipmanDurumu", alan: "equipmentStatus", tur: "durum", genislik: 120 },
  { key: "brand", labelKey: "marka", alan: "brand", genislik: 110 },
  { key: "model", labelKey: "model", alan: "model", genislik: 110, varsayilanGizli: true },
  { key: "machineCode", labelKey: "altEkipmanVeritabani.kolon.anaEkipmanKodu", alan: "machineCode", genislik: 150, varsayilanGizli: true },
  { key: "machineName", labelKey: "altEkipmanVeritabani.kolon.anaEkipmanTanimi", alan: "machineName", genislik: 200, varsayilanGizli: true },
  { key: "unit", labelKey: "altEkipmanVeritabani.kolon.birim", alan: "unit", genislik: 90, varsayilanGizli: true },
  { key: "revisionDate", labelKey: "altEkipmanVeritabani.kolon.revizyonTarihi", alan: "revisionDate", tur: "tarih", genislik: 130, varsayilanGizli: true },
  { key: "warrantyEndDate", labelKey: "altEkipmanVeritabani.kolon.garantiBitisTarihi", alan: "warrantyEndDate", tur: "tarih", genislik: 150, varsayilanGizli: true },
];

/** Kolon ayarlarinin tarayicidaki anahtari: [{ key, gorunur, genislik }] */
export const KOLON_AYARLARI_ANAHTARI = "altEkipmanVeritabani.kolonlar";

export const BOS_FILTRELER = {
  arama: "",
  durumIds: [],
  tipIds: [],
  markaIds: [],
  depoIds: [],
  lokasyonIds: [],
  makineIds: [],
};
