import dayjs from "dayjs";

/** Haftanin Pazartesi gunu; dayjs'in startOf("week")'i dile gore Pazar'dan baslayabildigi icin elle hesaplanir. */
const haftaBasi = (gun) => gun.subtract((gun.day() + 6) % 7, "day");

/**
 * Hazir donemler ve tarih araliklari (Yakit Stok Islemleri dokumani, "Sure Dropdown'i -> Tarih Donusumu").
 * "tarihAraligi" seciminde tarihleri kullanici girer.
 */
export const DONEMLER = [
  { value: "bugun", labelKey: "donemSecimi.bugun", aralik: (bugun) => [bugun, bugun] },
  { value: "dun", labelKey: "donemSecimi.dun", aralik: (bugun) => [bugun.subtract(1, "day"), bugun.subtract(1, "day")] },
  { value: "buHafta", labelKey: "donemSecimi.buHafta", aralik: (bugun) => [haftaBasi(bugun), bugun] },
  { value: "buAy", labelKey: "donemSecimi.buAy", aralik: (bugun) => [bugun.startOf("month"), bugun] },
  {
    value: "gecenAy",
    labelKey: "donemSecimi.gecenAy",
    aralik: (bugun) => [bugun.subtract(1, "month").startOf("month"), bugun.subtract(1, "month").endOf("month")],
  },
  { value: "son3Ay", labelKey: "donemSecimi.son3Ay", aralik: (bugun) => [bugun.subtract(3, "month"), bugun] },
  { value: "son6Ay", labelKey: "donemSecimi.son6Ay", aralik: (bugun) => [bugun.subtract(6, "month"), bugun] },
  { value: "buYil", labelKey: "donemSecimi.buYil", aralik: (bugun) => [bugun.startOf("year"), bugun.endOf("year")] },
  {
    value: "gecenYil",
    labelKey: "donemSecimi.gecenYil",
    aralik: (bugun) => [bugun.subtract(1, "year").startOf("year"), bugun.subtract(1, "year").endOf("year")],
  },
  { value: "tarihAraligi", labelKey: "donemSecimi.tarihAraligi", aralik: null },
];

/** Hazir donemin [baslangic, bitis] araligi (dayjs, gun basi). "tarihAraligi" icin null. */
export const donemAraligi = (donem) => {
  const secenek = DONEMLER.find((item) => item.value === donem);
  if (!secenek?.aralik) return null;
  return secenek.aralik(dayjs().startOf("day")).map((tarih) => tarih.startOf("day"));
};
