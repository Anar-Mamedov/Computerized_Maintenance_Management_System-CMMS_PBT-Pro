import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange, kelime }) {
  const [filters, setFilters] = React.useState({
    durumId: -1,
    baslangicTarihi: null,
    bitisTarihi: null,
    kelime: kelime || "",
  });

  React.useEffect(() => {
      onChange("filters", filters);
    }, [filters, onChange]);
  
    React.useEffect(() => {
      setFilters((prev) => ({ ...prev, kelime: kelime }));
    }, [kelime]);

  return (
    <>
      <ConditionFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters, // durumId
          }))
        }
      />

      <ZamanAraligi
        onSubmit={(dateRange) =>
          setFilters((state) => ({
            ...state,
            ...dateRange, // baslangicTarihi, bitisTarihi
          }))
        }
      />

      <CustomFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters, // kelime vb.
          }))
        }
      />
    </>
  );
}