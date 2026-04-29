import React from "react";
import LocationFilter from "./LocationFilter"; // Import edilmiş ama aşağıda kullanılmamıştı
import TankFilter from "./TankFilter";         // Import edilmiş ama aşağıda kullanılmamıştı
import YakitFilter from "./YakitFilter";
import Islemler from "./ConditionFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange }) {

  return (
    <>
      <ZamanAraligi
        onSubmit={(dates) => {
          onChange("BaslangicTarihi", dates.BaslangicTarihi);
          onChange("BitisTarihi", dates.BitisTarihi);
        }}
      />
      <LocationFilter
        onSubmit={(newIds) => onChange("LokasyonIds", newIds)}
      />

      <TankFilter
        onSubmit={(newIds) => onChange("DepoIds", newIds)}
      />

      <YakitFilter
        onSubmit={(newIds) => onChange("YakitIds", newIds)}
      />

      <Islemler
        onSubmit={(val) => onChange("SekmeTipi", val)} 
      />
    </>
  );
}