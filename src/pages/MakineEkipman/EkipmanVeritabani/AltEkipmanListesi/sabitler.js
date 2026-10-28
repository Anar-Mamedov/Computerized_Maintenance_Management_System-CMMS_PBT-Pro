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

export const BOS_FILTRELER = {
  arama: "",
  durumIds: [],
  tipIds: [],
  markaIds: [],
  depoIds: [],
  lokasyonIds: [],
  makineIds: [],
};
