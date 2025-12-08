import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange, kelime }) {
  const [filters, setFilters] = React.useState({
    tabDurumID: [-1], // Kanka burayı array başlattım
    BasTarih: null,
    BitTarih: null,
    Kelime: kelime || "",
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