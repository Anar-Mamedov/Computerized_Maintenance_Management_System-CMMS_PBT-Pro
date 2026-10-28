/** Transfer fisi durumlari (`statusId` / `statusKey`); rozet rengi antd Tag rengidir. */
export const TRANSFER_DURUMLARI = [
  { id: 0, key: "Draft", renk: "default" },
  { id: 1, key: "PendingApproval", renk: "orange" },
  { id: 2, key: "Approved", renk: "green" },
  { id: 3, key: "InTransit", renk: "blue" },
  { id: 4, key: "PartiallyDelivered", renk: "purple" },
  { id: 5, key: "Completed", renk: "success" },
];

/** Ekipmanin operasyonel durumu (`statusKey`). */
export const EKIPMAN_DURUMLARI = [
  { key: "Active", renk: "green" },
  { key: "InTransfer", renk: "blue" },
  { key: "InMaintenance", renk: "orange" },
  { key: "Idle", renk: "default" },
];

/** Transfer satirinin teslim durumu (`deliveryStatusKey`). */
export const TESLIM_EDILDI = "Delivered";

/** Ust KPI kartlari; `alan` GetList yanitindaki `kpi` nesnesinin alanidir. */
export const KPI_KARTLARI = [
  { alan: "totalTransfers", baslikKey: "ekipmanTransfer.kpi.toplam", ikon: "toplam" },
  { alan: "pendingApproval", baslikKey: "ekipmanTransfer.kpi.onayBekleyen", ikon: "onay" },
  { alan: "inTransit", baslikKey: "ekipmanTransfer.kpi.sevkiyatta", ikon: "sevkiyat" },
  { alan: "partiallyDelivered", baslikKey: "ekipmanTransfer.kpi.kismiTeslim", ikon: "kismi" },
  { alan: "completed", baslikKey: "ekipmanTransfer.kpi.tamamlanan", ikon: "tamam" },
];

export const SAYFA_BOYUTLARI = [10, 20, 50];
export const VARSAYILAN_SAYFA_BOYUTU = 10;
export const VARSAYILAN_SIRALAMA = { field: "transferId", order: "DESC" };

/** Liste filtrelerinin bos hali; tarih alanlari dayjs ya da null tutar. */
export const BOS_FILTRELER = {
  arama: "",
  baslangicTarihi: null,
  bitisTarihi: null,
  kaynakLokasyon: "",
  kaynakLokasyonID: null,
  hedefLokasyon: "",
  hedefLokasyonID: null,
  durum: null,
};

/** API tarih bicimleri (dokumandaki ornekler). */
export const LISTE_TARIH_BICIMI = "DD.MM.YYYY";
export const KAYIT_TARIH_BICIMI = "YYYY-MM-DD";
export const ISLEM_TARIH_SAAT_BICIMI = "DD.MM.YYYY HH:mm";
