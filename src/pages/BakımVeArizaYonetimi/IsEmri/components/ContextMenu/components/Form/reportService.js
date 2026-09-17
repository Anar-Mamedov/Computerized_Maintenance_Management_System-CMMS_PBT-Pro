import AxiosInstance from "../../../../../../../api/http";

/**
 * GetReportUrl endpoint'inin döndüğü yanıt.
 *
 * @typedef {Object} ReportUrlResponse
 * @property {boolean} [success] Rapor bağlantısının üretilip üretilmediği.
 * @property {string} [url] Raporun açılacağı tam adres.
 */

/**
 * Seçili kayıt için rapor bağlantısını getirir.
 *
 * @param {number} formId Formun sabit ID değeri (backend tarafında sabittir).
 * @param {number|string} idNo Raporu alınacak kaydın gerçek backend ID'si.
 * @returns {Promise<ReportUrlResponse>} Rapor bağlantısı yanıtı.
 */
export const getReportUrl = async (formId, idNo) => {
  const response = await AxiosInstance.get(`GetReportUrl?formId=${formId}&idNo=${idNo}`);

  // AxiosInstance interceptor'ı yanıtı zaten `response.data` olarak döndürür,
  // yine de her iki şekle karşı güvenli davranıyoruz.
  return response?.data || response || {};
};
