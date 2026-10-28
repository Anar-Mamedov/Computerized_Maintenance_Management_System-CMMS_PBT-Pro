import { ISLEM_TARIH_SAAT_BICIMI } from "./sabitler";

/** Ayri tarih ve saat seciciden gelen degerleri API'nin beklediği "DD.MM.YYYY HH:mm" metnine cevirir. */
export const tarihSaatMetni = (tarih, saat) =>
  tarih
    .hour(saat ? saat.hour() : 0)
    .minute(saat ? saat.minute() : 0)
    .format(ISLEM_TARIH_SAAT_BICIMI);

/** Bos metinler API'ye bos dize olarak gider. */
export const kirp = (deger) => (typeof deger === "string" ? deger.trim() : "");
