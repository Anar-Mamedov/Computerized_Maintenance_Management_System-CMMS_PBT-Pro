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

/**
 * Excel icin filtrelere uyan tum alt ekipmanlar (duz liste, ham yanit satirlari). Dokumanda disa aktarma ucu yok; once
 * toplam kayit ogrenilir, sonra liste ucundan tek sayfada (sayfa boyutu = toplam) istenir.
 */
export const getTumAltEkipmanlar = async (govde) => {
  const listeGovdesi = { ...govde, viewMode: "list", page: 1 };
  const ilkYanit = await getAltEkipmanListesi({ ...listeGovdesi, pageSize: 1 });
  const toplam = Number(ilkYanit.listData?.totalCount) || 0;
  if (toplam === 0) return [];

  const yanit = await getAltEkipmanListesi({ ...listeGovdesi, pageSize: toplam });
  return yanit.listData?.items ?? [];
};
