import React from "react";
import PropTypes from "prop-types";

/** Tasarimdaki kucuk sekmeli tekli secim (ornek: Tumu / Var / Yok). */
export default function SegmentSecimi({ secenekler, deger, onDegistir, ariaLabel }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="ek-segment">
      {secenekler.map((secenek) => (
        <button
          key={String(secenek.value)}
          type="button"
          role="radio"
          aria-checked={deger === secenek.value}
          className={deger === secenek.value ? "ek-segment--aktif" : ""}
          onClick={() => onDegistir(secenek.value)}
        >
          {secenek.label}
        </button>
      ))}
    </div>
  );
}

SegmentSecimi.propTypes = {
  secenekler: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  deger: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  onDegistir: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};
