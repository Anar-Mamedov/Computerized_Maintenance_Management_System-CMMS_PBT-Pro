import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";

/** Secim varken gorunen bant: secili sayisi, tek kayit secildiyse islemlerin hedefi ve "Secimi temizle". */
export default function SecimBandi({ seciliSatirlar, onTemizle }) {
  const { t, i18n } = useTranslation();
  if (seciliSatirlar.length === 0) return null;
  const hedef = seciliSatirlar.length === 1 ? seciliSatirlar[0] : null;

  return (
    <div className="ae-secim-bandi">
      <span className="ae-kalin ae-marka-metni">{t("altEkipmanVeritabani.seciliSayi", { sayi: formatNumberWithSeparators(seciliSatirlar.length, i18n.language) })}</span>
      {hedef ? (
        <span className="ae-soluk ae-tasan">
          {t("altEkipmanVeritabani.hedefKayit")}{" "}
          <strong className="ae-yazi">
            ({hedef.code}) {hedef.name}
          </strong>
        </span>
      ) : (
        <span className="ae-soluk">{t("altEkipmanVeritabani.tekKayitSecin")}</span>
      )}
      <button type="button" className="ae-link ae-secim-temizle" onClick={onTemizle}>
        {t("altEkipmanVeritabani.secimiTemizle")}
      </button>
    </div>
  );
}

SecimBandi.propTypes = {
  seciliSatirlar: PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string, name: PropTypes.string })).isRequired,
  onTemizle: PropTypes.func.isRequired,
};
