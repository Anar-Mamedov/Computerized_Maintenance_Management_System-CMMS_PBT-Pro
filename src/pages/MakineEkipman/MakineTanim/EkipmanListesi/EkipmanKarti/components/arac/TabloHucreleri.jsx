import React from "react";
import PropTypes from "prop-types";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";
import { bosIse } from "../../yardimcilar";

/*
 * Arac listelerinin ikincil (soluk) hucreleri. Hucre rengi tablo kuralindan geldigi icin soluk renk
 * hucre icindeki span'a verilir.
 */

/** Soluk metin; bos deger bosIse ile tire olarak gosterilir. */
export function SolukHucre({ deger }) {
  return <span className="ek-kart-soluk">{bosIse(deger)}</span>;
}

SolukHucre.propTypes = {
  deger: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

/** Soluk tarih (dile gore bicimli). */
export function TarihHucresi({ deger }) {
  return (
    <span className="ek-kart-soluk tabular-nums">
      <LocalizedDateText value={deger} fallback="—" />
    </span>
  );
}

TarihHucresi.propTypes = {
  deger: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
};
