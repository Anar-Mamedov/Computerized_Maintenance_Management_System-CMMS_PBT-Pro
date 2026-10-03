import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import RuhsatBilgileri from "./RuhsatBilgileri";
import Sigortalar from "./Sigortalar";
import Kazalar from "./Kazalar";
import Cezalar from "./Cezalar";

const ALT_SEKMELER = [
  { key: "ruhsat", etiketKey: "ekipmanKarti.arac.ruhsat" },
  { key: "sigorta", etiketKey: "ekipmanKarti.arac.sigortalar" },
  { key: "kaza", etiketKey: "ekipmanKarti.arac.kazalar" },
  { key: "ceza", etiketKey: "ekipmanKarti.arac.cezalar" },
];

const ILK_ALT_SEKME = ALT_SEKMELER[0].key;

/**
 * Arac sekmesi ("Arac" ozelligi isaretli ekipmanlarda gorunur): Ruhsat, Sigortalar, Kazalar ve Cezalar alt sekmeleri.
 * Alt sekmeler ilk acildiklarinda olusturulur (listeleri o an yuklenir), sonra gizlenerek korunur.
 * `aktif`: Arac sekmesi ekranda mi; ruhsat yalnizca gorunurken yuklenir.
 */
export default function AracDetaylari({ makineId, aktif }) {
  const { t } = useTranslation();
  const [altSekme, setAltSekme] = useState(ILK_ALT_SEKME);
  const [acilanAltSekmeler, setAcilanAltSekmeler] = useState([ILK_ALT_SEKME]);

  const altSekmeyiAc = (anahtar) => {
    setAltSekme(anahtar);
    setAcilanAltSekmeler((onceki) => (onceki.includes(anahtar) ? onceki : [...onceki, anahtar]));
  };

  const altSekmeyiCiz = (anahtar) => {
    switch (anahtar) {
      case "ruhsat":
        return <RuhsatBilgileri makineId={makineId} gorunur={aktif && altSekme === "ruhsat"} />;
      case "sigorta":
        return <Sigortalar makineId={makineId} />;
      case "kaza":
        return <Kazalar makineId={makineId} />;
      case "ceza":
        return <Cezalar makineId={makineId} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-semibold">{t("ekipmanKarti.arac.baslik")}</h2>

      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label={t("ekipmanKarti.arac.baslik")}>
        {ALT_SEKMELER.map((sekme) => (
          <button
            key={sekme.key}
            type="button"
            role="tab"
            aria-selected={sekme.key === altSekme}
            className={`ek-kart-hap ${sekme.key === altSekme ? "ek-kart-hap--aktif" : ""}`}
            onClick={() => altSekmeyiAc(sekme.key)}
          >
            {t(sekme.etiketKey)}
          </button>
        ))}
      </div>

      <div>
        {acilanAltSekmeler.map((anahtar) => (
          <div key={anahtar} role="tabpanel" hidden={anahtar !== altSekme}>
            {altSekmeyiCiz(anahtar)}
          </div>
        ))}
      </div>
    </div>
  );
}

AracDetaylari.propTypes = {
  makineId: PropTypes.number.isRequired,
  aktif: PropTypes.bool.isRequired,
};
