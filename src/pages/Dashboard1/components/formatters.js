import { formatNumberWithSeparators } from "../../../utils/numberLocale";

/** Para değerini aktif para birimi sembolü ile birlikte, iki ondalıklı gösterir. */
export const formatCurrency = (value, language, symbol) => `${symbol}${formatNumberWithSeparators(Number(value || 0).toFixed(2), language)}`;

/** Yüzde değerlerini "%12,4" biçiminde gösterir. */
export const formatPercent = (value, language) => `%${formatNumberWithSeparators(value ?? 0, language)}`;

/** Grafik eksenlerinde binlik ayraçlı kısa sayı gösterimi. */
export const formatAxisNumber = (value, language) => formatNumberWithSeparators(value, language);

// Grafik eksenlerinde ve etiketlerinde kullanılan kısaltma basamakları.
const COMPACT_STEPS = [
  { limit: 1e9, divisor: 1e9, suffixKey: "kisaltmaMilyar" },
  { limit: 1e6, divisor: 1e6, suffixKey: "kisaltmaMilyon" },
  { limit: 1e3, divisor: 1e3, suffixKey: "kisaltmaBin" },
];

/**
 * Para değerini grafiklerde okunaklı olacak şekilde kısaltır: 62200 -> "₺62,2 B".
 * @param {number} value Tutar
 * @param {string} language Aktif dil
 * @param {string} symbol Para birimi sembolü
 * @param {(key: string) => string} t Çeviri fonksiyonu
 */
export const formatCompactCurrency = (value, language, symbol, t) => {
  const numericValue = Number(value || 0);
  const step = COMPACT_STEPS.find(({ limit }) => Math.abs(numericValue) >= limit);

  if (!step) return `${symbol}${formatNumberWithSeparators(numericValue.toFixed(0), language)}`;

  const shortened = (numericValue / step.divisor).toFixed(1);
  // Bölünmeyen boşluk: recharts etiketi "₺56,5" ve "B" olarak iki satıra bölmesin.
  return `${symbol}${formatNumberWithSeparators(shortened, language)}\u00a0${t(step.suffixKey)}`;
};
