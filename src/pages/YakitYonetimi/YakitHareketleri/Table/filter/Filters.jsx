import React from "react";
import LocationFilter from "./LocationFilter"; // Import edilmiş ama aşağıda kullanılmamıştı
import TankFilter from "./TankFilter";         // Import edilmiş ama aşağıda kullanılmamıştı
import YakitFilter from "./YakitFilter";

export default function Filters({ onChange }) {

  return (
    <>
      <LocationFilter
        onSubmit={(newIds) => onChange("LokasyonIds", newIds)}
      />

      <TankFilter
        onSubmit={(newIds) => onChange("DepoIds", newIds)}
      />

      <YakitFilter
        onSubmit={(newIds) => onChange("YakitIds", newIds)}
      />
    </>
  );
}