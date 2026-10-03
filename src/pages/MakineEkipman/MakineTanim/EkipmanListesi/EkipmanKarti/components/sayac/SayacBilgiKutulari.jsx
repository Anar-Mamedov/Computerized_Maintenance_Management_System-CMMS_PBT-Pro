import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import BilgiKutusu from "../ortak/BilgiKutusu";
import { bosIse, sayiMetni } from "../../yardimcilar";

/** Okuma / sifirlama modallarinin ustundeki "Sayac" ve "Mevcut Deger" kutucuklari. */
export default function SayacBilgiKutulari({ sayac }) {
  const { t, i18n } = useTranslation();
  const deger = sayiMetni(sayac.guncelDeger, i18n.language);

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      <BilgiKutusu etiket={t("ekipmanKarti.sayac.sayac")} title={sayac.tanim ?? undefined}>
        {bosIse(sayac.tanim)}
      </BilgiKutusu>
      <BilgiKutusu etiket={t("ekipmanKarti.sayac.mevcutDeger")} className="tabular-nums">
        {deger ? [deger, sayac.birim].filter(Boolean).join(" ") : "—"}
      </BilgiKutusu>
    </div>
  );
}

SayacBilgiKutulari.propTypes = {
  sayac: PropTypes.shape({
    tanim: PropTypes.string,
    guncelDeger: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    birim: PropTypes.string,
  }).isRequired,
};
