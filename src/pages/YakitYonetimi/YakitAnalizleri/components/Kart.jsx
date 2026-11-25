import React from "react";
import PropTypes from "prop-types";

/** Dashboard karti: baslik, alt baslik, sag ustte istege bagli eylem (ör. "Tip analizi →") ve icerik. */
export default function Kart({ baslik, altBaslik, eylem, children, className = "" }) {
  return (
    <section className={`ya-kart flex min-w-0 flex-col ${className}`}>
      <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <h3 className="m-0 text-[15px] font-semibold">{baslik}</h3>
          {altBaslik && <p className="m-0 mt-0.5 text-[12px] text-(--ya-muted)">{altBaslik}</p>}
        </div>
        {eylem}
      </header>
      {children}
    </section>
  );
}

Kart.propTypes = {
  baslik: PropTypes.string.isRequired,
  altBaslik: PropTypes.node,
  eylem: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};

/** Kart basligindaki baglanti gorunumlu eylem dugmesi. */
export function KartEylemi({ etiket, onClick }) {
  return (
    <button type="button" className="ya-kart-eylemi" onClick={onClick}>
      {etiket} →
    </button>
  );
}

KartEylemi.propTypes = { etiket: PropTypes.string.isRequired, onClick: PropTypes.func.isRequired };
