import React from "react";
import LocationFilter from "./LocationFilter"; 
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange }) {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <LocationFilter
        onSubmit={(newIds) => onChange("LokasyonIds", newIds)} 
      />

      <ZamanAraligi
        onChange={(type, value) => onChange(type, value)} 
      />
    </div>
  );
}