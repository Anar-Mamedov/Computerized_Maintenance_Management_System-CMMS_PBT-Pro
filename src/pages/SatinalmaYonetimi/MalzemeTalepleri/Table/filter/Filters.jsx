import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange }) {
  const [filters, setFilters] = React.useState({
    tabDurumID: -1,
    BasTarih: null,
    BitTarih: null,
    Kelime: "",
  });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <>
      <ConditionFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters, // tabDurumID
          }))
        }
      />

      <ZamanAraligi
        onSubmit={(dateRange) =>
          setFilters((state) => ({
            ...state,
            ...dateRange, // BasTarih, BitTarih
          }))
        }
      />

      <CustomFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters, // Kelime vb.
          }))
        }
      />
    </>
  );
}