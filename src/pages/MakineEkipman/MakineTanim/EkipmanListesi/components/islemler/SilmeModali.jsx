import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import OnayModali from "./OnayModali";
import { siraylaCalistir, sonucuBildir } from "./topluCalistir";
import { silEkipman } from "../../ekipmanService";

/** Secili ekipmanlari mevcut DeleteMakine ucu ile siler. */
export default function SilmeModali({ satirlar, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [yukleniyor, setYukleniyor] = useState(false);

  const onayla = async () => {
    setYukleniyor(true);
    const basarili = await siraylaCalistir(satirlar, (satir) => silEkipman(satir.TB_MAKINE_ID));
    setYukleniyor(false);
    sonucuBildir(basarili, satirlar.length, t);
    if (basarili > 0) onTamamlandi();
  };

  return (
    <OnayModali
      acik
      tehlikeli
      baslik={t("ekipmanListesi.silme.baslik")}
      soru={t("ekipmanListesi.silme.soru", { adet: satirlar.length })}
      aciklama={t("ekipmanListesi.silme.aciklama")}
      onayMetni={t("sil")}
      yukleniyor={yukleniyor}
      onOnay={onayla}
      onVazgec={onKapat}
    />
  );
}

SilmeModali.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.shape({ TB_MAKINE_ID: PropTypes.number })).isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
