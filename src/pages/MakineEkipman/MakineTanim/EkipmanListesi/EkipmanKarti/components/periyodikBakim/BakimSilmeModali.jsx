import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import OnayModali from "../ortak/OnayModali";
import { siraylaCalistir } from "../../../components/islemler/topluCalistir";
import { silMakineBakimi } from "../../ekipmanKartiService";

/** Secili bakimlari makineden kaldirir; tek kayitlik uc her kayit icin sirayla cagrilir. */
export default function BakimSilmeModali({ kayitlar, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [siliniyor, setSiliniyor] = useState(false);

  const sil = async () => {
    setSiliniyor(true);
    const basarili = await siraylaCalistir(kayitlar, (kayit) => silMakineBakimi(kayit.TB_PERIYODIK_BAKIM_MAKINE_ID));
    setSiliniyor(false);

    if (basarili === kayitlar.length) message.success(t("ekipmanKarti.silindi"));
    else if (basarili > 0) message.warning(t("ekipmanKarti.bakim.kismenBasarili", { basarili, toplam: kayitlar.length }));
    else message.error(t("ekipmanKarti.islemBasarisiz"));

    if (basarili > 0) onTamamlandi();
  };

  return (
    <OnayModali
      acik
      tehlikeli
      baslik={t("ekipmanKarti.silOnayBaslik")}
      mesaj={kayitlar.length > 1 ? t("ekipmanKarti.bakim.silOnayMesajCoklu", { sayi: kayitlar.length }) : t("ekipmanKarti.silOnayMesaj")}
      onayMetni={t("ekipmanKarti.sil")}
      yukleniyor={siliniyor}
      onOnay={sil}
      onKapat={onKapat}
    />
  );
}

BakimSilmeModali.propTypes = {
  kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
