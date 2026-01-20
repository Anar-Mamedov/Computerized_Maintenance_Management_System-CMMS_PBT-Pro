import React from "react";
import LocationFilter from "./LocationFilter"; // Import edilmiş ama aşağıda kullanılmamıştı
import TypeFilter from "./TypeFilter";         // Import edilmiş ama aşağıda kullanılmamıştı

export default function Filters({ onChange }) {

  return (
    <>
      <LocationFilter
        onSubmit={(newIds) => onChange("LokasyonIds", newIds)}
      />

      <TypeFilter
        onSubmit={(newIds) => onChange("YakitTipIds", newIds)}
      />
    </>
  );
}