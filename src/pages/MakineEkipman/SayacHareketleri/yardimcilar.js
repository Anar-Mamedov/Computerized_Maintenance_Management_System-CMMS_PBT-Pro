import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import { API_TARIH_BICIMI } from "./sabitler";

/**
 * Sayiyi dile gore ayiricilarla yazar. `ondalik` verilirse o kadar basamak gosterilir; verilmezse tam sayilar
 * oldugu gibi, kesirliler tek basamakla yazilir (ör. 4.5 saat -> "4,5").
 */
export const sayiMetni = (deger, dil, ondalik) => {
  if (deger === null || deger === undefined || deger === "") return "–";
  const sayi = Number(deger);
  if (Number.isNaN(sayi)) return String(deger);
  if (ondalik !== undefined) return formatNumberWithSeparators(sayi.toFixed(ondalik), dil);
  return formatNumberWithSeparators(Number.isInteger(sayi) ? sayi : Number(sayi.toFixed(1)), dil);
};

/** Artis degerleri isaretli yazilir: +4, 0, -2. */
export const artisMetni = (deger, dil) => (Number(deger) > 0 ? `+${sayiMetni(deger, dil)}` : sayiMetni(deger, dil));

/** Ortak filtre govdesi (CounterMovementFilterModel); hazir surede tarihler, ozel aralikta `period` bos gider. */
export const filtreGovdesi = (filtreler) => ({
  search: filtreler.arama.trim(),
  period: filtreler.sure.period,
  startDate: filtreler.sure.startDate ? filtreler.sure.startDate.format(API_TARIH_BICIMI) : null,
  endDate: filtreler.sure.endDate ? filtreler.sure.endDate.format(API_TARIH_BICIMI) : null,
  locationIds: filtreler.lokasyonIds,
  equipmentIds: filtreler.ekipmanIds,
  counterTypeIds: filtreler.sayacTipIds,
  includeKpi: true,
});

/** React render icin istemci anahtari; API'ye her zaman backend ID'si gider. */
export const anahtarEkle = (liste, idAlani) => (Array.isArray(liste) ? liste : []).map((satir, index) => ({ ...satir, clientKey: `${satir[idAlani] ?? "satir"}-${index}` }));
