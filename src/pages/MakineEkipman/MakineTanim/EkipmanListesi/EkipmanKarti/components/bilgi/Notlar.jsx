import React from "react";
import { useTranslation } from "react-i18next";
import Bolum from "../ortak/Bolum";
import Textarea from "../../../../../../../utils/components/Form/Textarea";

const NOT_ALANI_STILI = { minHeight: 220, width: "100%" };

/** Notlar sekmesi: genel not ve guvenlik notu (eski karttaki alanlar). */
export default function Notlar() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <Bolum baslik={t("ekipmanKarti.notlar.genelNot")} altBaslik={t("ekipmanKarti.notlar.genelNotAciklama")}>
        <Textarea name="makineGenelNot" styles={NOT_ALANI_STILI} />
      </Bolum>
      <Bolum baslik={t("ekipmanKarti.notlar.guvenlikNotu")} altBaslik={t("ekipmanKarti.notlar.guvenlikNotuAciklama")}>
        <Textarea name="makineGuvenlikNotu" styles={NOT_ALANI_STILI} />
      </Bolum>
    </div>
  );
}
