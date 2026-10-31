import { message } from "antd";
import { t } from "i18next";
import AxiosInstance from "../api/http";

/**
 * GetReportUrl'in urettigi raporu (FastReport PDF) yeni sekmede acar. Acilir pencere engeline takilmamak icin
 * bos sekme tiklama aninda acilir, adres gelince o sekmeye yuklenir. Tiklama olayinin icinde, ilk await'ten
 * once cagrilmalidir.
 *
 * @param {number} formId Formun backend'de sabit olan ID'si.
 * @param {number|string} idNo Raporu alinacak kaydin gercek backend ID'si.
 */
export async function raporuYeniSekmedeAc(formId, idNo) {
  const pencere = window.open("", "_blank");
  if (!pencere) {
    message.error(t("rapor.pencereAcilamadi"));
    return;
  }
  pencere.opener = null;

  try {
    const yanit = await AxiosInstance.get("GetReportUrl", { params: { formId, idNo } });
    const veri = yanit?.data || yanit || {};
    const adres = typeof veri.url === "string" ? veri.url.trim() : "";

    if (veri.success === false || !adres) {
      pencere.close();
      message.error(t("rapor.alinamadi"));
      return;
    }

    pencere.location.href = adres;
  } catch (error) {
    console.error("Rapor bağlantısı alınamadı:", error);
    pencere.close();
    message.error(error?.response?.data?.message || t("rapor.alinamadi"));
  }
}
