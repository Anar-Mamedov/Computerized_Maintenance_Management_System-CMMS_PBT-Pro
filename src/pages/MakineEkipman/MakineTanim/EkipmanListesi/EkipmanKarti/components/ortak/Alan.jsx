import React from "react";
import PropTypes from "prop-types";

/** Etiketli form alani. Icine global form bilesenleri verilir; hata metinlerini bilesenler kendisi yazar. */
export default function Alan({ etiket, zorunlu = false, className = "", children }) {
  return (
    <div className={`ek-kart-alan min-w-0 ${className}`}>
      <div className="ek-kart-etiket">
        {etiket}
        {zorunlu && <span className="ek-kart-etiket__yildiz">*</span>}
      </div>
      {children}
    </div>
  );
}

Alan.propTypes = {
  etiket: PropTypes.node.isRequired,
  zorunlu: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
