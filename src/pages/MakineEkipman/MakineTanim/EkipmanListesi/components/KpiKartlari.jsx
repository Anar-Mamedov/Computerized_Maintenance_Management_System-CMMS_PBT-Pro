import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuAlertTriangle, LuBoxes, LuCalendarClock, LuClipboardList } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";

/**
 * Kartlar tiklaninca listeyi daraltir; ayni anda tek kart filtresi uygulanir (EkipmanListesi.kpiFiltresi).
 * "Toplam Ekipman" kart filtrelerini kaldirir.
 */
const KARTLAR = [
  { key: "toplam", alan: "ToplamEkipman", baslikKey: "ekipmanListesi.kpi.toplamEkipman", aciklamaKey: "ekipmanListesi.kpi.toplamEkipmanAciklama", Ikon: LuBoxes, filtre: "temizle" },
  { key: "acikIsEmri", alan: "AcikIsEmri", baslikKey: "ekipmanListesi.kpi.acikIsEmri", aciklamaKey: "ekipmanListesi.kpi.acikIsEmriAciklama", Ikon: LuClipboardList, filtre: "acikIsEmri" },
  { key: "aktifAriza", alan: "AktifAriza", baslikKey: "ekipmanListesi.kpi.aktifAriza", aciklamaKey: "ekipmanListesi.kpi.aktifArizaAciklama", Ikon: LuAlertTriangle, filtre: "arizali" },
  { key: "gecikenBakim", alan: "GecikenBakim", baslikKey: "ekipmanListesi.kpi.gecikenBakim", aciklamaKey: "ekipmanListesi.kpi.gecikenBakimAciklama", Ikon: LuCalendarClock, filtre: "gecikti" },
];

const aktifMi = (filtre, filtreler) =>
  (filtre === "arizali" && filtreler.arizali === true) || (filtre === "gecikti" && filtreler.bakimDurumu === "Gecikti") || (filtre === "acikIsEmri" && filtreler.acikIsEmri === true);

export default function KpiKartlari({ kpi, filtreler, onKpiFiltresi }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {KARTLAR.map(({ key, alan, baslikKey, aciklamaKey, Ikon, filtre }) => {
        const deger = kpi?.[alan];
        const icerik = (
          <>
            <div className="flex items-start justify-between gap-3">
              <p className="m-0 text-[13px] font-medium text-(--ek-muted)">{t(baslikKey)}</p>
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-(--ek-border) text-(--ek-subtle)">
                <Ikon size={14} />
              </span>
            </div>
            <p className="m-0 mt-2 text-2xl font-semibold tracking-tight">{deger === undefined || deger === null ? "–" : formatNumberWithSeparators(deger, i18n.language)}</p>
            <p className="m-0 mt-1.5 text-[11px] text-(--ek-subtle)">{t(aciklamaKey)}</p>
          </>
        );

        const aktif = aktifMi(filtre, filtreler);
        return (
          <button
            key={key}
            type="button"
            className={`ek-kpi ${aktif ? "ek-kpi--aktif" : ""}`}
            aria-pressed={aktif}
            aria-label={t("ekipmanListesi.kpi.filtreyiUygula", { ad: t(baslikKey) })}
            onClick={() => onKpiFiltresi(filtre)}
          >
            {icerik}
          </button>
        );
      })}
    </div>
  );
}

KpiKartlari.propTypes = {
  kpi: PropTypes.shape({
    ToplamEkipman: PropTypes.number,
    AcikIsEmri: PropTypes.number,
    AktifAriza: PropTypes.number,
    GecikenBakim: PropTypes.number,
  }),
  filtreler: PropTypes.shape({
    arizali: PropTypes.bool,
    bakimDurumu: PropTypes.string,
    acikIsEmri: PropTypes.bool,
  }).isRequired,
  onKpiFiltresi: PropTypes.func.isRequired,
};
