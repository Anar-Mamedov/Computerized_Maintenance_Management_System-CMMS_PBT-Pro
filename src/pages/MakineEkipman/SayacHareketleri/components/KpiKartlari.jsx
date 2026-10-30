import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { KPI_KARTLARI } from "../sabitler";
import { sayiMetni } from "../yardimcilar";

/**
 * Acik sekmenin yanitindaki `kpi` nesnesinden beslenen dort kart. Tek birim secildiyse (`unit`) toplam ve
 * gunluk ortalama birimiyle yazilir; sayac kaydi eksik ekipman varsa sayi kirmizi gosterilir.
 */
export default function KpiKartlari({ kpi }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="sh-kpi-izgarasi">
      {KPI_KARTLARI.map(({ alan, baslikKey, aciklamaKey, birimli, ondalik, uyari }) => {
        const deger = kpi?.[alan];
        const birim = birimli && kpi?.unit ? ` ${kpi.unit}` : "";
        const kirmizi = uyari && Number(deger) > 0;
        return (
          <div key={alan} className="sh-kart sh-kpi">
            <span className="sh-kpi-baslik">{t(baslikKey)}</span>
            <span className={`sh-kpi-deger ${kirmizi ? "sh-kpi-deger--uyari" : ""}`}>{deger === undefined || deger === null ? "–" : `${sayiMetni(deger, i18n.language, ondalik)}${birim}`}</span>
            <span className="sh-soluk sh-kpi-aciklama">{t(aciklamaKey)}</span>
          </div>
        );
      })}
    </div>
  );
}

KpiKartlari.propTypes = {
  kpi: PropTypes.shape({
    totalIncrement: PropTypes.number,
    activeEquipmentCount: PropTypes.number,
    averageDailyUsage: PropTypes.number,
    missingReadingEquipmentCount: PropTypes.number,
    unit: PropTypes.string,
  }),
};
