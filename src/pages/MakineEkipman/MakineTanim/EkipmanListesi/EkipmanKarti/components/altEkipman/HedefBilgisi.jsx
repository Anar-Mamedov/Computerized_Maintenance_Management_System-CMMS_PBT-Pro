import React from "react";
import { useTranslation } from "react-i18next";
import BilgiKutusu from "../ortak/BilgiKutusu";
import { hedefTipi } from "./altEkipmanYardimcilari";

/** Ekleme pencerelerinde yeni kaydin baglanacagi yer (secili grup / ekipman ya da makine). */
export default function HedefBilgisi({ hedef }) {
  const { t } = useTranslation();

  return (
    <BilgiKutusu etiket={t("ekipmanKarti.altEkipman.hedef")} title={hedef.etiket}>
      {hedef.etiket}
    </BilgiKutusu>
  );
}

HedefBilgisi.propTypes = {
  hedef: hedefTipi.isRequired,
};
