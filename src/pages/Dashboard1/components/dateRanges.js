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
