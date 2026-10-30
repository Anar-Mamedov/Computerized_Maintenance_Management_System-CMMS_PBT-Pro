/** Sekmeler; `excelTab` ExportExcel ucuna giden `tab` degeridir. */
export const SEKMELER = [
  { key: "hareketler", labelKey: "sayacHareketleri.sekme.hareketler", excelTab: "movements" },
  { key: "ozet", labelKey: "sayacHareketleri.sekme.ozet", excelTab: "summary" },
  { key: "karsilastirma", labelKey: "sayacHareketleri.sekme.karsilastirma", excelTab: "comparison" },
];

/** Karsilastirma gruplamasi (`groupBy`). */
export const GRUPLAMALAR = [
  { key: "equipmentType", labelKey: "sayacHareketleri.grup.equipmentType" },
  { key: "brand", labelKey: "sayacHareketleri.grup.brand" },
  { key: "location", labelKey: "sayacHareketleri.grup.location" },
];

/** Backend'in `sourceType` metinleri -> ceviri anahtari. */
export const KAYIT_KAYNAKLARI = { ENTEGRASYON: "entegrasyon", MOBİL: "mobil", MOBIL: "mobil", MANUEL: "manuel" };

/** Ust KPI kartlari; `alan` yanittaki `kpi` nesnesinin alanidir. */
export const KPI_KARTLARI = [
  { alan: "totalIncrement", baslikKey: "sayacHareketleri.kpi.toplam", aciklamaKey: "sayacHareketleri.kpi.toplamAciklama", birimli: true },
  { alan: "activeEquipmentCount", baslikKey: "sayacHareketleri.kpi.kayitliEkipman", aciklamaKey: "sayacHareketleri.kpi.kayitliEkipmanAciklama" },
  { alan: "averageDailyUsage", baslikKey: "sayacHareketleri.kpi.gunlukOrtalama", aciklamaKey: "sayacHareketleri.kpi.gunlukOrtalamaAciklama", birimli: true, ondalik: 1 },
  { alan: "missingReadingEquipmentCount", baslikKey: "sayacHareketleri.kpi.eksikKayit", aciklamaKey: "sayacHareketleri.kpi.eksikKayitAciklama", uyari: true },
];

export const SAYAC_TIP_KOD_GRUBU = 32702;
export const SAYFA_BOYUTLARI = [15, 30, 50, 100];
export const VARSAYILAN_SAYFA_BOYUTU = 15;
export const API_TARIH_BICIMI = "YYYY-MM-DD";

/** Varsayilan sure: dokumanda tarih gonderilmezse de son 30 gun alinir. */
export const VARSAYILAN_SURE = { period: "last30days", startDate: null, endDate: null };

export const BOS_FILTRELER = { arama: "", sure: VARSAYILAN_SURE, lokasyonIds: [], ekipmanIds: [], sayacTipIds: [] };
