import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuLayoutGrid, LuList } from "react-icons/lu";

const GORUNUMLER = [
  { value: "liste", labelKey: "ekipmanListesi.gorunumListe", ariaKey: "ekipmanListesi.gorunumListeAria", Ikon: LuList },
  { value: "kartlar", labelKey: "ekipmanListesi.gorunumKartlar", ariaKey: "ekipmanListesi.gorunumKartlarAria", Ikon: LuLayoutGrid },
];

/** Liste / Kartlar gorunum secici. */
export default function GorunumSecici({ gorunum, onGorunumDegistir }) {
  const { t } = useTranslation();

  return (
    <div role="group" aria-label={t("ekipmanListesi.gorunumSecici")} className="inline-flex h-9 shrink-0 items-center gap-0.5 rounded-md border border-(--ek-border) bg-(--ek-card) p-0.5">
      {GORUNUMLER.map(({ value, labelKey, ariaKey, Ikon }) => (
        <button
          key={value}
          type="button"
          aria-label={t(ariaKey)}
          aria-pressed={gorunum === value}
          className={`ek-gorunum-btn ${gorunum === value ? "ek-gorunum-btn--aktif" : ""}`}
          onClick={() => onGorunumDegistir(value)}
        >
          <Ikon size={16} />
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}

GorunumSecici.propTypes = {
  gorunum: PropTypes.oneOf(["liste", "kartlar"]).isRequired,
  onGorunumDegistir: PropTypes.func.isRequired,
};
