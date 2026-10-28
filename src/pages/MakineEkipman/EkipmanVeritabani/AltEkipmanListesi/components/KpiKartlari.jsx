import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuBoxes, LuLink, LuPackage, LuTrash2 } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";
import { BAGLANTI_SEKMELERI } from "../sabitler";

const IKONLAR = { toplam: LuBoxes, stok: LuPackage, bagli: LuLink, hurda: LuTrash2 };

/**
 * Dort KPI karti. Kart tiklaninca ayni hizli sekme filtresi uygulanir; sayilar sekme filtresinden onceki toplamlardir
 * (backend), bu yuzden sekme degisince sifirlanmaz.
 */
export default function KpiKartlari({ kpi, baglanti, onBaglantiDegistir }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="ae-kpi-izgarasi">
      {BAGLANTI_SEKMELERI.map(({ deger, kpiLabelKey, kpiAlani, ikon }) => {
        const Ikon = IKONLAR[ikon];
        const sayi = kpi?.[kpiAlani];
        return (
          <button key={deger} type="button" className={`ae-kart ae-kpi ${baglanti === deger ? "ae-kpi--aktif" : ""}`} aria-pressed={baglanti === deger} onClick={() => onBaglantiDegistir(deger)}>
            <span className={`ae-kpi-ikon ae-kpi-ikon--${ikon}`}>
              <Ikon size={16} />
            </span>
            <span className="ae-kpi-metin">
              <span className="ae-soluk ae-kucuk">{t(kpiLabelKey)}</span>
              <span className="ae-kpi-deger">{sayi === undefined || sayi === null ? "–" : formatNumberWithSeparators(sayi, i18n.language)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

KpiKartlari.propTypes = {
  kpi: PropTypes.shape({
    totalCount: PropTypes.number,
    inStockCount: PropTypes.number,
    connectedCount: PropTypes.number,
    scrapCount: PropTypes.number,
  }),
  baglanti: PropTypes.string.isRequired,
  onBaglantiDegistir: PropTypes.func.isRequired,
};
