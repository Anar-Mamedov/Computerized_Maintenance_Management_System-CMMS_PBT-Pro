// Ekipman Listesi ekraninin sabitleri. Deger/ID'ler backend tarafinda sabittir.

/** KodList grup numaralari (makine formundaki KodIDSelectbox'lar ile ayni). */
export const KOD_GRUPLARI = {
  makineTipi: 32501,
  kategori: 32502,
  makineDurumu: 32505,
  sayacBirimi: 32701,
  sayacTipi: 32702,
  // Sigorta turu (MSG_SIGORTA_KOD_ID) grubu dokumanda yok; canli API'den teyit edilecek.
  sigortaTuru: null,
};

/** Kayit durumu (GetEkipmanFullList `isAktif`: 1 aktif, 0 pasif, -1 hepsi). Varsayilan: dokumandaki gibi yalnizca aktifler. */
export const VARSAYILAN_KAYIT_DURUMU = 1;

/** Periyodik bakim durumlari; `value` API'ye birebir gonderilir. */
export const BAKIM_DURUMLARI = [
  { value: "Normal", labelKey: "ekipmanListesi.bakim.normal", ton: "success" },
  { value: "Yaklaşıyor", labelKey: "ekipmanListesi.bakim.yaklasiyor", ton: "warning" },
  { value: "Gecikti", labelKey: "ekipmanListesi.bakim.gecikti", ton: "danger" },
];

export const SAYFA_BOYUTLARI = [20, 50, 100];
export const VARSAYILAN_SAYFA_BOYUTU = 20;

export const VARSAYILAN_SIRALAMA = { field: "MKN_KOD", order: "ASC" };

/** Eski tablodaki ozel alan kolonlari: veri alani ve OzelAlan?form=MAKINE yanitindaki baslik alani. */
const OZEL_ALANLAR = Array.from({ length: 20 }, (_, index) => {
  const no = index + 1;
  // 11-15 arasi kod listesi alanlaridir; eski tablo da bu alanlari gosteriyordu.
  const alan = no >= 11 && no <= 15 ? `MKN_OZEL_ALAN_${no}_KOD_ID` : `MKN_OZEL_ALAN_${no}`;
  return { key: `ozelAlan${no}`, alan, ozelAlanNo: no, genislik: 150, varsayilanGizli: true };
});

/**
 * Tablo kolonlari (varsayilan sira). Ilk sekizi tasarimin kolonlaridir; digerleri eski tablodaki
 * kolonlardir ve varsayilan olarak gizlidir.
 * - `alan`: satirdaki veri alani. Alan API yanitinda yoksa kolon, kolon ayarlarinda listelenmez.
 * - `tur`: ozel hucre gorunumu (yoksa duz metin; "sayi" ortak sayi formatiyla); `sortField`: API siralama degeri (yoksa siralanamaz).
 */
export const KOLONLAR = [
  { key: "ekipman", labelKey: "ekipmanListesi.kolon.ekipman", tur: "ekipman", sortField: "MKN_KOD", genislik: 210 },
  { key: "lokasyon", labelKey: "lokasyon", tur: "lokasyon", sortField: "MKN_LOKASYON", genislik: 160 },
  { key: "tip", labelKey: "ekipmanTipi", alan: "MKN_TIP", sortField: "MKN_TIP", genislik: 130 },
  { key: "marka", labelKey: "marka", alan: "MKN_MARKA", sortField: "MKN_MARKA", genislik: 100 },
  { key: "model", labelKey: "model", alan: "MKN_MODEL", sortField: "MKN_MODEL", genislik: 105 },
  { key: "durum", labelKey: "durum", tur: "durum", sortField: "MKN_DURUM", genislik: 92 },
  { key: "bakim", labelKey: "ekipmanListesi.kolon.periyodikBakim", tur: "bakim", sortField: "BAKIM_HEDEF_TARIH", genislik: 132 },
  { key: "atolye", labelKey: "ekipmanListesi.kolon.sorumluAtolye", alan: "MKN_ATOLYE", sortField: "MKN_ATOLYE", genislik: 120 },
  { key: "id", baslik: "#", alan: "TB_MAKINE_ID", genislik: 90, varsayilanGizli: true },
  { key: "belge", labelKey: "ekipmanListesi.kolon.belge", alan: "MKN_BELGE_VAR", tur: "evetHayir", genislik: 90, varsayilanGizli: true },
  { key: "resim", labelKey: "ekipmanListesi.kolon.resim", alan: "MKN_RESIM_VAR", tur: "evetHayir", genislik: 90, varsayilanGizli: true },
  { key: "aktif", labelKey: "aktif", alan: "MKN_AKTIF", tur: "evetHayir", genislik: 90, varsayilanGizli: true },
  { key: "kategori", labelKey: "kategori", alan: "MKN_KATEGORI", genislik: 150, varsayilanGizli: true },
  { key: "masterTanim", labelKey: "ekipmanListesi.kolon.masterEkipmanTanimi", alan: "MKN_MASTER_MAKINE_TANIM", genislik: 150, varsayilanGizli: true },
  { key: "masterKod", labelKey: "ekipmanListesi.kolon.masterEkipmanKodu", alan: "MKN_MASTER_MAKINE_KOD", genislik: 150, varsayilanGizli: true },
  { key: "takvim", labelKey: "ekipmanListesi.kolon.calismaTakvimi", alan: "MKN_TAKVIM", genislik: 150, varsayilanGizli: true },
  { key: "uretimYili", labelKey: "uretimYili", alan: "MKN_URETIM_YILI", sortField: "MKN_URETIM_YILI", genislik: 110, varsayilanGizli: true },
  { key: "masrafMerkezi", labelKey: "ekipmanListesi.kolon.masrafMerkezi", alan: "MKN_MASRAF_MERKEZ", genislik: 150, varsayilanGizli: true },
  { key: "bakimGrubu", labelKey: "ekipmanListesi.kolon.bakimGrubu", alan: "MKN_BAKIM_GRUP", genislik: 150, varsayilanGizli: true },
  { key: "arizaGrubu", labelKey: "ekipmanListesi.kolon.arizaGrubu", alan: "MKN_ARIZA_GRUP", genislik: 150, varsayilanGizli: true },
  { key: "oncelik", labelKey: "ekipmanListesi.kolon.oncelik", alan: "MKN_ONCELIK", genislik: 150, varsayilanGizli: true },
  { key: "arizaSikligi", labelKey: "ekipmanListesi.kolon.arizaSikligi", alan: "ARIZA_SIKLIGI", tur: "sayi", genislik: 150, varsayilanGizli: true },
  { key: "arizaSayisi", labelKey: "arizaSayisi", alan: "ARIZA_SAYISI", tur: "sayi", genislik: 150, varsayilanGizli: true },
  { key: "tamLokasyon", labelKey: "ekipmanListesi.kolon.tamLokasyon", alan: "MKN_LOKASYON_TUM_YOL", genislik: 300, varsayilanGizli: true },
  { key: "anaLokasyon", labelKey: "ekipmanListesi.anaLokasyon", alan: "MKN_ANA_LOKASYON", sortField: "MKN_ANA_LOKASYON", genislik: 200, varsayilanGizli: true },
  { key: "seriNo", labelKey: "seriNo", alan: "MKN_SERI_NO", sortField: "MKN_SERI_NO", genislik: 150, varsayilanGizli: true },
  ...OZEL_ALANLAR,
];

/** Kullanici tercihleri (tarayiciya ozel). */
export const DEPOLAMA_ANAHTARLARI = {
  gorunum: "ekipmanListesi.gorunum",
  sayfaBoyutu: "ekipmanListesi.sayfaBoyutu",
  siralama: "ekipmanListesi.siralama",
  // Kolonlarin sirasi, gorunurlugu ve genisligi: [{ key, gorunur, genislik }]
  kolonlar: "ekipmanListesi.kolonlar",
};

/** Ekipman Formu (FastReport PDF) icin GetReportUrl `formId` degeri; backend'de sabittir. */
export const EKIPMAN_FORMU_ID = 5;
