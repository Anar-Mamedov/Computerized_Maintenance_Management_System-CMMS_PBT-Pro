import React from "react";
import PropTypes from "prop-types";

/** Modallardaki etiket + deger kutucugu (ek-kart-bilgi). Uzun deger kirpilir; `title` ile tamami gosterilir. */
export default function BilgiKutusu({ etiket, title, className = "", children }) {
  return (
    <div className={`ek-kart-bilgi ${className}`}>
      <p className="ek-kart-bilgi__etiket">{etiket}</p>
      <p className="ek-kart-bilgi__deger" title={title}>
        {children}
      </p>
    </div>
  );
}

BilgiKutusu.propTypes = {
  etiket: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
