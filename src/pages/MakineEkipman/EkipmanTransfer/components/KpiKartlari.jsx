import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuCheckCircle, LuClock, LuLayers, LuPackageOpen, LuTruck } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../../utils/numberLocale";
import { KPI_KARTLARI } from "../sabitler";

const IKONLAR = {
  toplam: { Ikon: LuLayers, sinif: "" },
  onay: { Ikon: LuClock, sinif: "et-kpi-ikon--turuncu" },
  sevkiyat: { Ikon: LuTruck, sinif: "et-kpi-ikon--mavi" },
  kismi: { Ikon: LuPackageOpen, sinif: "et-kpi-ikon--mor" },
  tamam: { Ikon: LuCheckCircle, sinif: "et-kpi-ikon--yesil" },
};

/** GetList yanitindaki `kpi` nesnesinden beslenen bes ozet kart. */
export default function KpiKartlari({ kpi }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="et-kpi-izgarasi">
      {KPI_KARTLARI.map(({ alan, baslikKey, ikon }) => {
        const { Ikon, sinif } = IKONLAR[ikon];
        const deger = kpi?.[alan];
        return (
          <div key={alan} className="et-kart et-kpi">
            <div className="et-kpi-ust">
              <span>{t(baslikKey)}</span>
              <Ikon size={16} className={`et-kpi-ikon ${sinif}`} />
            </div>
            <span className="et-kpi-deger">{deger === undefined || deger === null ? "–" : formatNumberWithSeparators(deger, i18n.language)}</span>
          </div>
        );
      })}
    </div>
  );
}

KpiKartlari.propTypes = {
  kpi: PropTypes.shape({
    totalTransfers: PropTypes.number,
    pendingApproval: PropTypes.number,
    inTransit: PropTypes.number,
    partiallyDelivered: PropTypes.number,
    completed: PropTypes.number,
  }),
};
