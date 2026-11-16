import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import BilgiKutusu from "../ortak/BilgiKutusu";
import { bosIse } from "../../yardimcilar";

// Kod ve tanim pencerenin alt basligindadir; kunyede tekrar edilmez.
const ALANLAR = [
  { alan: "EKP_SERI_NO", etiketKey: "ekipmanKarti.altEkipman.kolon.seriNo" },
  { alan: "EKP_TIP", etiketKey: "ekipmanKarti.altEkipman.kolon.tip" },
  { alan: "EKP_DURUM", etiketKey: "ekipmanKarti.altEkipman.kolon.durum" },
  { alan: "EKP_MARKA", etiketKey: "ekipmanKarti.altEkipman.kolon.marka" },
  { alan: "EKP_MODEL", etiketKey: "ekipmanKarti.altEkipman.kolon.model" },
];

/** Tarihce pencerelerinin ustundeki ekipman kunyesi (seri no, tip, durum, marka, model). */
export default function EkipmanKunyesi({ ekipman }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {ALANLAR.map(({ alan, etiketKey }) => (
        <BilgiKutusu key={alan} etiket={t(etiketKey)} title={String(ekipman[alan] ?? "")}>
          {bosIse(ekipman[alan])}
        </BilgiKutusu>
      ))}
    </div>
  );
}

EkipmanKunyesi.propTypes = {
  /** Ekipman kaydi: agactaki dugum, dolasim tarihcesinde backend'in `ekipman` kunyesiyle birlesmis hali. */
  ekipman: PropTypes.object.isRequired,
};
