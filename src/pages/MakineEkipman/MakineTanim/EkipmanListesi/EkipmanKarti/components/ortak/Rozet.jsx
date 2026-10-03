import React from "react";
import PropTypes from "prop-types";

/** Durum rozeti. Tonlar tasarimdaki success / warning / destructive / primary / muted karsiliklaridir. */
export default function Rozet({ ton = "notr", children }) {
  return <span className={`ek-kart-rozet ek-kart-rozet--${ton}`}>{children}</span>;
}

Rozet.propTypes = {
  ton: PropTypes.oneOf(["basari", "uyari", "hata", "birincil", "notr"]),
  children: PropTypes.node,
};
