import { useEffect, useState } from "react";
import { message } from "antd";
import { getTransfer, hataMesaji } from "./transferService";
import { camelCaseYap } from "../EkipmanVeritabani/AltEkipmanListesi/yardimcilar";

/**
 * React render icin ekipman satirlarina istemci anahtari eklenir; API'ye her zaman `equipmentId` gider.
 * Canli API alanlari PascalCase (EquipmentId, EquipmentCode) donuyor; ekran camelCase okudugu icin satirlar once cevrilir.
 */
export const ekipmanSatirlariniHazirla = (liste) =>
  camelCaseYap(Array.isArray(liste) ? liste : []).map((satir, index) => ({ ...satir, clientKey: `${satir.equipmentId ?? "ekipman"}-${index}` }));

/** Pencere acikken fisin detayini (GetById) yukler; kapaninca birakir. */
export default function useTransferDetayi(transferId, acik) {
  const [detay, setDetay] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (!acik || !transferId) {
      setDetay(null);
      return undefined;
    }

    let iptal = false;
    setYukleniyor(true);
    getTransfer(transferId)
      .then((yanit) => {
        if (!iptal) setDetay({ ...yanit.data, equipments: ekipmanSatirlariniHazirla(yanit.data?.equipments) });
      })
      .catch((hata) => {
        if (iptal) return;
        console.error("Transfer detayı alınamadı:", hata);
        message.error(hataMesaji(hata));
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });

    return () => {
      iptal = true;
    };
  }, [transferId, acik]);

  return { detay, yukleniyor };
}
