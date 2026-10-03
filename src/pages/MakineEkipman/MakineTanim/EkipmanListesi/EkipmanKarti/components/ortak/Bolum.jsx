import React from "react";
import PropTypes from "prop-types";

/** Tasarimdaki bolum karti: baslik, alt baslik, istege bagli sag ust eylem ve govde. */
export default function Bolum({ baslik, altBaslik, eylem, govdeSinifi = "p-5", className = "", children }) {
  return (
    <section className={`ek-kart-bolum ${className}`}>
      <header className="ek-kart-bolum__baslik">
        <div className="min-w-0">
          <h3>{baslik}</h3>
          {altBaslik && <p>{altBaslik}</p>}
        </div>
        {eylem}
      </header>
      <div className={govdeSinifi}>{children}</div>
    </section>
  );
}

Bolum.propTypes = {
  baslik: PropTypes.node.isRequired,
  altBaslik: PropTypes.node,
  eylem: PropTypes.node,
  govdeSinifi: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
