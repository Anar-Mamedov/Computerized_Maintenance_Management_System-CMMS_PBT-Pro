import React from "react";
import LocationFilter from "./LocationFilter"; // Import edilmiş ama aşağıda kullanılmamıştı
import TypeFilter from "./TypeFilter";         // Import edilmiş ama aşağıda kullanılmamıştı
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange }) {

  return (
    <>
      <LocationFilter
        onSubmit={(newIds) => onChange("LokasyonIds", newIds)} 
      />

      <ZamanAraligi
        onSubmit={(newIds) => onChange("LokasyonIds", newIds)} 
      />
    </>
  );
}