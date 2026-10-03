import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";

/** Tasarimdaki onay kutusu satiri (ek-kart-secim) icin react-hook-form alani. */
export default function SecimKutusu({ name, etiket, disabled = false, className = "" }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className={`ek-kart-secim ${disabled ? "ek-kart-secim--pasif" : ""} ${className}`}>
          <input type="checkbox" checked={Boolean(field.value)} disabled={disabled} onChange={(olay) => field.onChange(olay.target.checked)} onBlur={field.onBlur} />
          <span className="min-w-0 truncate">{etiket}</span>
        </label>
      )}
    />
  );
}

SecimKutusu.propTypes = {
  name: PropTypes.string.isRequired,
  etiket: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
