import React from "react";
import LocationFilter from "./LocationFilter";
import MachineFilter from "./MachineFilter"; 
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange }) {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <LocationFilter
        onSubmit={(newIds) => onChange("LokasyonIds", newIds)} 
      />

      <MachineFilter
        onSubmit={(newIds) => onChange("EkipmanIds", newIds)} 
      />

      <ZamanAraligi
        onChange={(type, value) => onChange(type, value)} 
      />
    </div>
  );
}