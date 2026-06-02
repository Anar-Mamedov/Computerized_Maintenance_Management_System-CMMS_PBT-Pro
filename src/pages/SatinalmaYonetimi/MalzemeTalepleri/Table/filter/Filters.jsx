import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange, kelime, hatirlaticiGrupId, hatirlaticiSiraId }) {
  const [filters, setFilters] = React.useState(() => {
    let initialDurum = [-1];
    if (hatirlaticiGrupId && hatirlaticiSiraId) {
      if (Number(hatirlaticiSiraId) === 1) {
        initialDurum = [1];
      } else if (Number(hatirlaticiSiraId) === 4) {
        initialDurum = [7];
      }
    }
    return {
      tabDurumID: initialDurum,
      BasTarih: null,
      BitTarih: null,
      Kelime: kelime || "",
    };
  });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, Kelime: kelime }));
  }, [kelime]);

  return (
    <>
      <ConditionFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters, // tabDurumID artık array gelecek
          }))
        }
        hatirlaticiGrupId={hatirlaticiGrupId}
        hatirlaticiSiraId={hatirlaticiSiraId}
      />

      <ZamanAraligi
        onSubmit={(dateRange) =>
          setFilters((state) => ({
            ...state,
            ...dateRange, 
          }))
        }
      />

      <CustomFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters, 
          }))
        }
      />
    </>
  );
}