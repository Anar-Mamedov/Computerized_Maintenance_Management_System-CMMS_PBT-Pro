import { t } from "i18next";
import AxiosInstance from "../../../api/http";

/**
 * Sayac Hareketleri uclari (COUNTER_MOVEMENT_FRONTEND_GUIDE.md). Filtreli uclar POST + JSON govde ile cagrilir.
 *
 * @typedef {Object} SayacKpi
 * @property {number} totalIncrement
 * @property {number} activeEquipmentCount
 * @property {number} averageDailyUsage
 * @property {number} missingReadingEquipmentCount
 * @property {string} unit  Tek birim secildiyse "km" / "h", aksi halde ""
 */

/** Backend mesajini (yanit govdesi ya da HTTP hata govdesi) kullaniciya gosterilecek metne cevirir. */
export const hataMesaji = (hataVeyaYanit) => hataVeyaYanit?.response?.data?.message || hataVeyaYanit?.message || t("hataOlustu");

/** `hasError` donen yanit hataya cevrilir; boylece cagiran tek bir catch ile ilgilenir. */
const yanitiDenetle = (yanit) => {
  if (!yanit || yanit.hasError === true) throw yanit;
  return yanit;
};

export const getHareketListesi = (govde) => AxiosInstance.post("CounterMovement/GetMovementList", govde).then(yanitiDenetle);

export const getEkipmanOzeti = (govde) => AxiosInstance.post("CounterMovement/GetEquipmentSummary", govde).then(yanitiDenetle);

export const getKarsilastirma = (govde) => AxiosInstance.post("CounterMovement/GetComparison", govde).then(yanitiDenetle);

export const getHareketDetayi = (readingId) => AxiosInstance.get("CounterMovement/GetMovementDetail", { params: { id: readingId } }).then(yanitiDenetle);

/** Excel ucu dosya ya da JSON donebilir; ikisini de ayirt edebilmek icin yanit Blob olarak alinir. */
export const getExcelVerisi = (govde) => AxiosInstance.post("CounterMovement/ExportExcel", govde, { responseType: "blob" });
