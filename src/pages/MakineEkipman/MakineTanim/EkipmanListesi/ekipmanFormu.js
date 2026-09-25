import { message } from "antd";
import { getEkipmanFormuBaglantisi } from "./ekipmanService";

/**
 * Ekipman formunu (PDF) yeni sekmede acar. Is Emri formlariyla ayni akis: popup engeline takilmamak icin
 * bos sekme tiklama aninda acilir, GetReportUrl'den gelen adres gelince o sekmeye yuklenir.
 */
export async function ekipmanFormunuAc(makineId, t) {
  const pencere = window.open("", "_blank");
  if (!pencere) {
    message.error(t("ekipmanListesi.pencereAcilamadi"));
    return;
  }
  pencere.opener = null;

  try {
    const yanit = await getEkipmanFormuBaglantisi(makineId);
    const adres = typeof yanit?.url === "string" ? yanit.url.trim() : "";

    if (yanit?.success === false || !adres) {
      pencere.close();
      message.error(t("ekipmanListesi.formAlinamadi"));
      return;
    }

    pencere.location.href = adres;
  } catch (error) {
    console.error("Ekipman formu bağlantısı alınamadı:", error);
    pencere.close();
    message.error(error?.response?.data?.message || t("ekipmanListesi.formAlinamadi"));
  }
}
