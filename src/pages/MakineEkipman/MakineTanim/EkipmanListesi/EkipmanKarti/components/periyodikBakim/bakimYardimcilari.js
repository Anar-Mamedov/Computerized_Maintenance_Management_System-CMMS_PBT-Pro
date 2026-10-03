import dayjs from "dayjs";
import { sayiMetni } from "../../yardimcilar";

/** Bos olmayan deger (0 dahil). */
export const doluMu = (deger) => deger !== null && deger !== undefined && deger !== "";

/** API'deki DURUM_CLASS -> Rozet tonu. */
export const ROZET_TONLARI = { success: "basari", warning: "uyari", danger: "hata", primary: "birincil" };

const DOLGU_SINIFLARI = { warning: "ek-kart-ilerleme__dolgu--uyari", danger: "ek-kart-ilerleme__dolgu--hata", primary: "ek-kart-ilerleme__dolgu--birincil" };
const SATIR_SINIFLARI = { warning: "ek-kart-satir--uyari", danger: "ek-kart-satir--hata" };

export const satirSinifi = (kayit) => `ek-kart-satir--tiklanir ${SATIR_SINIFLARI[kayit.DURUM_CLASS] ?? ""}`.trim();

export const dolguSinifi = (durum) => `ek-kart-ilerleme__dolgu ${DOLGU_SINIFLARI[durum] ?? ""}`.trim();

/** Kod ve tanimi tek satirda birlestirir ("KOD - Tanim"). */
export const kodVeTanim = (kod, tanim) => [kod, tanim].filter(doluMu).join(" - ");

/** Isaretli sayi metni: "+120", "-4", "0". */
export const isaretliSayi = (deger, dil) => {
  const sayi = Number(deger);
  if (!Number.isFinite(sayi)) return String(deger);
  const metin = sayiMetni(Math.abs(sayi), dil);
  if (sayi > 0) return `+${metin}`;
  return sayi < 0 ? `-${metin}` : metin;
};

/** Kalan metinleri: sayac varsa ana metin sayac, gun de varsa "diger" satiri; sayac yoksa ana metin gun. */
export const kalanMetinleri = (kayit, t, dil) => {
  const sayac = doluMu(kayit.KALAN_SAYAC) ? `${isaretliSayi(kayit.KALAN_SAYAC, dil)} ${kayit.SAYAC_BIRIM ?? ""}`.trim() : null;
  const gun = doluMu(kayit.KALAN_GUN) ? t("ekipmanKarti.bakim.gunMetni", { gun: isaretliSayi(kayit.KALAN_GUN, dil) }) : null;
  return { ana: sayac ?? gun, diger: sayac && gun ? t("ekipmanKarti.bakim.digerKalan", { deger: gun }) : null };
};

export const gecikmisMi = (kayit) => doluMu(kayit.KALAN_GUN) && Number(kayit.KALAN_GUN) < 0;

/**
 * Ilerleme cubugu orani (0..1): son uygulamadan hedef tarihe kadar gecen surenin orani.
 * Tarihler yoksa gecikmis (danger) kayitta cubuk dolu, digerlerinde cubuk gosterilmez (null).
 */
export const ilerlemeOrani = (kayit) => {
  const son = dayjs(kayit.SON_UYGULAMA_TARIH);
  const hedef = dayjs(kayit.HEDEF_TARIH);
  if (kayit.SON_UYGULAMA_TARIH && kayit.HEDEF_TARIH && son.isValid() && hedef.isValid()) {
    const toplamSure = hedef.diff(son);
    const oran = toplamSure > 0 ? dayjs().diff(son) / toplamSure : 1;
    return Math.min(Math.max(oran, 0), 1);
  }
  return kayit.DURUM_CLASS === "danger" ? 1 : null;
};

/** Son uygulama sayaci (alan adi canli API'de teyit edilecek). */
export const sonSayac = (kayit) => kayit.SON_UYGULAMA_SAYAC ?? kayit.PBM_SON_UYGULAMA_SAYAC;
