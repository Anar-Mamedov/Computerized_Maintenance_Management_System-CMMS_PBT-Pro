import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuCalendarPlus, LuClipboardList, LuPackage, LuXCircle } from "react-icons/lu";
import "./bakimIslemleri.css";

/** Yesil dugme menusundeki bakim islemleri. Islemler tek secili hucre icin calisir. */
export default function BakimIslemleri({ selectedCells, onSec }) {
  const { t } = useTranslation();
  const tekHucre = selectedCells.length === 1;

  const islemler = [
    { tur: "isEmri", ikon: LuClipboardList, anahtar: "isEmriOlustur", aktif: tekHucre },
    { tur: "planla", ikon: LuCalendarPlus, anahtar: "ileriTarihePlanla", aktif: tekHucre },
    // Bakimdan malzeme talebi olusturan API henuz yok.
    { tur: "malzeme", ikon: LuPackage, anahtar: "malzemeIhtiyaci", aktif: false },
    { tur: "iptal", ikon: LuXCircle, anahtar: "bakimIptal", aktif: tekHucre, tehlikeli: true },
  ];

  return (
    <div className="ptk-bakim-islemleri">
      {islemler.map(({ tur, ikon: Ikon, anahtar, aktif, tehlikeli }) => (
        <React.Fragment key={tur}>
          {tehlikeli && <div className="ptk-bakim-islemleri__ayrac" />}
          <button type="button" className={`ptk-bakim-islemleri__oge ${tehlikeli ? "is-tehlikeli" : ""}`} disabled={!aktif} onClick={() => onSec({ tur, hucre: selectedCells[0] })}>
            <Ikon size={16} className="ptk-bakim-islemleri__ikon" />
            <span>
              <span className="ptk-bakim-islemleri__baslik">{t(`planlamaTakvimi.menu.${anahtar}`)}</span>
              <span className="ptk-bakim-islemleri__aciklama">{t(`planlamaTakvimi.menu.${anahtar}Aciklama`)}</span>
            </span>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

BakimIslemleri.propTypes = {
  selectedCells: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSec: PropTypes.func.isRequired,
};
