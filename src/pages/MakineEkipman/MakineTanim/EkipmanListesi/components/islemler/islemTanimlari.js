import { LuClipboardEdit, LuExternalLink, LuFileText, LuGauge, LuHistory, LuMapPin, LuPower, LuQrCode, LuShapes, LuShieldCheck, LuToggleLeft, LuTrash2 } from "react-icons/lu";

/**
 * Ekipman islemleri. `tekKayit` olanlar yalnizca tek bir ekipman secildiginde calisir.
 * Anahtarlar EkipmanListesi.jsx'teki islem yonlendirmesinde kullanilir.
 */
export const ISLEMLER = {
  detay: { Ikon: LuExternalLink, baslikKey: "ekipmanListesi.islemler.detayiAc", aciklamaKey: "ekipmanListesi.islemler.detayiAcAciklama", tekKayit: true },
  aktiflik: { Ikon: LuPower, baslikKey: "ekipmanListesi.islemler.aktiflik", aciklamaKey: "ekipmanListesi.islemler.aktiflikAciklama", tekKayit: false },
  isEmri: { Ikon: LuClipboardEdit, baslikKey: "ekipmanListesi.islemler.isEmriOlustur", aciklamaKey: "ekipmanListesi.islemler.isEmriOlusturAciklama", tekKayit: true },
  sayac: { Ikon: LuGauge, baslikKey: "ekipmanListesi.islemler.sayacTanimla", aciklamaKey: "ekipmanListesi.islemler.sayacTanimlaAciklama", tekKayit: false },
  tip: { Ikon: LuShapes, baslikKey: "ekipmanListesi.islemler.tipDegistir", aciklamaKey: "ekipmanListesi.islemler.tipDegistirAciklama", tekKayit: false },
  durum: { Ikon: LuToggleLeft, baslikKey: "ekipmanListesi.islemler.durumDegistir", aciklamaKey: "ekipmanListesi.islemler.durumDegistirAciklama", tekKayit: false },
  lokasyon: { Ikon: LuMapPin, baslikKey: "ekipmanListesi.islemler.lokasyonDegistir", aciklamaKey: "ekipmanListesi.islemler.lokasyonDegistirAciklama", tekKayit: false },
  sigorta: { Ikon: LuShieldCheck, baslikKey: "ekipmanListesi.islemler.sigorta", aciklamaKey: "ekipmanListesi.islemler.sigortaAciklama", tekKayit: true },
  tarihce: { Ikon: LuHistory, baslikKey: "ekipmanListesi.islemler.tarihce", aciklamaKey: "ekipmanListesi.islemler.tarihceAciklama", tekKayit: true },
  sil: { Ikon: LuTrash2, baslikKey: "ekipmanListesi.islemler.sil", aciklamaKey: "ekipmanListesi.islemler.silAciklama", tekKayit: false, tehlikeli: true },
  form: { Ikon: LuFileText, baslikKey: "ekipmanListesi.islemler.ekipmanFormu", aciklamaKey: "ekipmanListesi.islemler.ekipmanFormuAciklama", tekKayit: true },
  barkod: { Ikon: LuQrCode, baslikKey: "ekipmanListesi.islemler.barkod", aciklamaKey: "ekipmanListesi.islemler.barkodAciklama", tekKayit: true },
};

/** Yesil islem dugmesinin menusu (secili kayitlar uzerinde calisir). */
export const TOPLU_MENU_BOLUMLERI = [
  { key: "makine", baslikKey: "ekipmanListesi.islemler.bolumMakine", islemler: ["aktiflik", "isEmri"] },
  { key: "toplu", baslikKey: "ekipmanListesi.islemler.bolumToplu", islemler: ["sayac", "tip", "durum", "lokasyon"] },
  { key: "diger", baslikKey: "ekipmanListesi.islemler.bolumDiger", islemler: ["sigorta", "tarihce", "sil"] },
  { key: "formlar", baslikKey: "ekipmanListesi.islemler.bolumFormlar", islemler: ["form", "barkod"] },
];

/** Satira sag tiklandiginda ve kart menusunde gosterilen islemler. */
export const SATIR_MENUSU = ["detay", "isEmri", "lokasyon", "tarihce", "barkod"];
