import { t } from "i18next";
import AxiosInstance from "../../../../api/http";

/**
 * Alt Ekipman Veritabani liste / agac ucu (SUB_EQUIPMENT_DATABASE_FRONTEND_GUIDE.md).
 * `viewMode` "list" iken `listData`, "tree" iken `treeData` doner; ikisinde de `kpi` gelir.
 */

/** Backend mesajini (yanit govdesi ya da HTTP hata govdesi) kullaniciya gosterilecek metne cevirir. */
export const hataMesaji = (hataVeyaYanit) => hataVeyaYanit?.response?.data?.message || hataVeyaYanit?.message || t("hataOlustu");

export const getAltEkipmanListesi = (govde) =>
  AxiosInstance.post("GetEkipmanVeritabaniListe", govde).then((yanit) => {
    if (!yanit || yanit.hasError === true) throw yanit;
    return yanit;
  });
