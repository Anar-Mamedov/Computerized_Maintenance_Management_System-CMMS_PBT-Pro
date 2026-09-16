import dayjs from "dayjs";

/** Tarih filtresindeki hazır aralıklar; her biri [başlangıç, bitiş] döndürür. */
export const HAZIR_ARALIKLAR = {
  tumu: () => [null, null],
  bugun: () => [dayjs().startOf("day"), dayjs().endOf("day")],
  dun: () => [dayjs().subtract(1, "day").startOf("day"), dayjs().subtract(1, "day").endOf("day")],
  buHafta: () => [dayjs().startOf("week"), dayjs().endOf("week")],
  gecenHafta: () => [dayjs().subtract(1, "week").startOf("week"), dayjs().subtract(1, "week").endOf("week")],
  buAy: () => [dayjs().startOf("month"), dayjs().endOf("month")],
  gecenAy: () => [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")],
  buYil: () => [dayjs().startOf("year"), dayjs().endOf("year")],
  gecenYil: () => [dayjs().subtract(1, "year").startOf("year"), dayjs().subtract(1, "year").endOf("year")],
  son1Ay: () => [dayjs().subtract(1, "month"), dayjs()],
  son3Ay: () => [dayjs().subtract(3, "month"), dayjs()],
  son6Ay: () => [dayjs().subtract(6, "month"), dayjs()],
};

/** Widget'ların kendi dönem seçicilerindeki kodları [başlangıç, bitiş] aralığına çevirir. */
const WIDGET_DONEM_ARALIKLARI = {
  "30GUN": () => [dayjs().subtract(30, "day").startOf("day"), dayjs().endOf("day")],
  "60GUN": () => [dayjs().subtract(60, "day").startOf("day"), dayjs().endOf("day")],
  "90GUN": () => [dayjs().subtract(90, "day").startOf("day"), dayjs().endOf("day")],
  BUHAFTA: () => HAZIR_ARALIKLAR.buHafta(),
  BUAY: () => HAZIR_ARALIKLAR.buAy(),
  GECENAY: () => HAZIR_ARALIKLAR.gecenAy(),
  SON3AY: () => HAZIR_ARALIKLAR.son3Ay(),
  BUYIL: () => HAZIR_ARALIKLAR.buYil(),
};

/**
 * Widget'ın kendi dönem seçimini hedef liste ekranının beklediği startDate/endDate'e çevirir.
 * Bu widget'lar dashboard'un üst tarih filtresini değil kendi dönemlerini kullandığı için,
 * tıklanınca hedef ekrana da kendi dönemleri taşınmalıdır.
 */
export const donemdenTarihAraligi = (donem, ozelBaslangic, ozelBitis) => {
  if (donem === "OZEL") {
    const baslangic = ozelBaslangic ? dayjs(ozelBaslangic) : null;
    const bitis = ozelBitis ? dayjs(ozelBitis) : null;
    return {
      ...(baslangic?.isValid() ? { startDate: baslangic.format("YYYY-MM-DD") } : {}),
      ...(bitis?.isValid() ? { endDate: bitis.format("YYYY-MM-DD") } : {}),
    };
  }

  const aralikUret = WIDGET_DONEM_ARALIKLARI[donem];
  if (!aralikUret) return {};

  const [baslangic, bitis] = aralikUret();
  return { startDate: baslangic.format("YYYY-MM-DD"), endDate: bitis.format("YYYY-MM-DD") };
};
