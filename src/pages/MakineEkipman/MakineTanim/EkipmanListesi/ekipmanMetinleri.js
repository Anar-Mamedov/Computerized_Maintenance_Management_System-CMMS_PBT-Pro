import { BAKIM_DURUMLARI } from "./constants";

const TURKCE_HARFLER = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };

/** Arama ve karsilastirma icin: kucuk harf, Turkce karakterler sadelesmis. */
export const metniSadelestir = (metin) =>
  String(metin ?? "")
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]/g, (harf) => TURKCE_HARFLER[harf]);

/** API'nin BAKIM_DURUM degerini ("Yaklaşıyor", "yaklasiyor" vb.) sabit listedeki karsiligina esler. */
export const bakimDurumunuBul = (deger) => {
  const aranan = metniSadelestir(deger);
  if (!aranan) return null;
  return BAKIM_DURUMLARI.find((durum) => metniSadelestir(durum.value) === aranan) || null;
};

/** Durum rozetinin rengi: pasif/arsiv gri, bakim/ariza turuncu, digerleri marka rengi. */
export const durumTonu = (satir) => {
  const durum = metniSadelestir(satir.MKN_DURUM);
  if (satir.MKN_AKTIF === false || durum.includes("pasif") || durum.includes("arsiv")) return "neutral";
  if (durum.includes("bakim") || durum.includes("ariza")) return "warning";
  return "brand";
};
