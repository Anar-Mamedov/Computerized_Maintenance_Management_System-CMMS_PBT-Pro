import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";

/** Tasarimdaki radyo satirlari: secili satir vurgulu (ek-kart-secim--secili), digerleri soluk (--pasif). */
export default function SecimRadyolari({ name, secenekler, className = "space-y-1.5" }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={className}>
          {secenekler.map((secenek) => {
            const secili = field.value === secenek.deger;
            return (
              <label key={secenek.deger} className={`ek-kart-secim ${secili ? "ek-kart-secim--secili" : "ek-kart-secim--pasif"}`}>
                <input type="radio" name={name} checked={secili} onChange={() => field.onChange(secenek.deger)} onBlur={field.onBlur} />
                <span className="min-w-0 truncate">{secenek.etiket}</span>
              </label>
            );
          })}
        </div>
      )}
    />
  );
}

SecimRadyolari.propTypes = {
  name: PropTypes.string.isRequired,
  secenekler: PropTypes.arrayOf(PropTypes.shape({ deger: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, etiket: PropTypes.node.isRequired })).isRequired,
  className: PropTypes.string,
};
