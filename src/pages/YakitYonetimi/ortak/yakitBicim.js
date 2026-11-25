import { formatNumberWithSeparators } from "../../../utils/numberLocale";

const bosMu = (deger) => deger === null || deger === undefined || deger === "" || Number.isNaN(Number(deger));

/**
 * Miktar, tutar, fiyat ve yuzde degerleri: dokumandaki gibi iki ondalik basamakla, dilin ayiraclariyla.
 * Bos deger "–" yazilir.
 */
export const ondalikli = (deger, dil) => (bosMu(deger) ? "–" : formatNumberWithSeparators(Number(deger).toFixed(2), dil));

/** Sayilar (ekipman sayisi, km, saat): ondalik zorlanmadan, dilin ayiraclariyla. */
export const sayi = (deger, dil) => (bosMu(deger) ? "–" : formatNumberWithSeparators(Number(deger), dil));

/** Yuzde ("%34,30" / "34,30%"); isaretin yeri dil dosyasindan gelir. Bos deger "–" yazilir ("%–" degil). */
export const yuzde = (deger, dil, t) => (bosMu(deger) ? "–" : t("yakitOrtak.yuzde", { deger: ondalikli(deger, dil) }));

/** Onceki doneme gore fark yuzdesi: isaretli ("+%8,40" / "-%4,20"); yuzde isaretinin yeri dil dosyasindan gelir. */
export const isaretliYuzde = (deger, dil, t) => {
  if (bosMu(deger)) return "–";
  const isaret = Number(deger) > 0 ? "+" : Number(deger) < 0 ? "-" : "";
  return `${isaret}${t("yakitOrtak.yuzde", { deger: ondalikli(Math.abs(Number(deger)), dil) })}`;
};
