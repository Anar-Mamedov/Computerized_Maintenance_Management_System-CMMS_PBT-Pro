import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

/** Toplu islem modallarinin ustundeki "N ekipman secildi" bilgi seridi. */
export default function SecimBilgisi({ adet, aciklama }) {
  const { t } = useTranslation();

  return (
    <div className="ek-secim-bilgisi">
      <span className="shrink-0 text-[13px] font-semibold text-(--ek-brand)">{t("ekipmanListesi.ekipmanSecildi", { adet })}</span>
      <p className="m-0 text-[12px] leading-relaxed text-(--ek-muted)">{aciklama}</p>
    </div>
  );
}

SecimBilgisi.propTypes = {
  adet: PropTypes.number.isRequired,
  aciklama: PropTypes.string.isRequired,
};
