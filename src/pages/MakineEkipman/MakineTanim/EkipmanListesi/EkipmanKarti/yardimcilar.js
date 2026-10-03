import dayjs from "dayjs";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";

/** Tablo kolon basliklari icin dile gore buyuk harf (CSS uppercase Turkce "i" harfini "I" yapar). */
export const buyukHarf = (metin, dil) => String(metin ?? "").toLocaleUpperCase(dil || "tr");

/** Ekranda gosterilen sayilar: ortak ayiraclarla, en fazla iki ondalik. Deger yoksa bos metin. */
export const sayiMetni = (deger, dil) => {
  if (deger === null || deger === undefined || deger === "") return "";
  const sayi = Number(deger);
  if (!Number.isFinite(sayi)) return String(deger);
  return formatNumberWithSeparators(Math.round(sayi * 100) / 100, dil);
};

/** Bos degerleri ekranda "—" ile gosterir. */
export const bosIse = (deger, yerine = "—") => (deger === null || deger === undefined || String(deger).trim() === "" ? yerine : deger);

/** API'ye giden tarih: YYYY-MM-DD (gecersizse null). */
export const apiTarihi = (deger) => {
  if (!deger) return null;
  const tarih = dayjs(deger);
  return tarih.isValid() ? tarih.format("YYYY-MM-DD") : null;
};

/** API'ye giden saat: HH:mm:ss (gecersizse null). */
export const apiSaati = (deger) => {
  if (!deger) return null;
  const saat = dayjs(deger);
  return saat.isValid() ? saat.format("HH:mm:ss") : null;
};

/** API'den gelen tarih (string) -> form degeri (dayjs ya da null). */
export const formTarihi = (deger, bicim) => {
  if (!deger) return null;
  const tarih = bicim ? dayjs(String(deger), bicim) : dayjs(deger);
  return tarih.isValid() ? tarih : null;
};

/** "HH:mm" / "HH:mm:ss" saat metni -> form degeri (dayjs ya da null). */
export const formSaati = (deger) => {
  if (!deger) return null;
  const saat = dayjs(`2000-01-01 ${String(deger).trim()}`);
  return saat.isValid() ? saat : null;
};

/** Bos metinleri null yapar, digerlerini kirpar. */
export const metinYaDaNull = (deger) => {
  if (typeof deger !== "string") return deger ?? null;
  const kirpilmis = deger.trim();
  return kirpilmis.length ? kirpilmis : null;
};

/** Sayiya cevrilebilen degerler sayi, digerleri null. */
export const sayiYaDaNull = (deger) => {
  if (deger === null || deger === undefined || deger === "") return null;
  const sayi = Number(deger);
  return Number.isFinite(sayi) ? sayi : null;
};

/** Tablo satirlarina React anahtari ekler; API'ye her zaman backend ID'si gider (RULES kural 13). */
export const anahtarEkle = (kayitlar, idAlani) =>
  (Array.isArray(kayitlar) ? kayitlar : []).map((kayit, index) => ({ ...kayit, clientKey: `${kayit?.[idAlani] ?? "kayit"}-${index}` }));
