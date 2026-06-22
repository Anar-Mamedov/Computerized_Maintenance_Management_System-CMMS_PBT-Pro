import React from "react";
import LocationFilter from "./LocationFilter";
import AtolyeFilter from "./AtolyeFilter";
import PersonelFilter from "./PersonelFilter";

export default function Filters({ onChange }) {
  const [filters, setFilters] = React.useState({
    PersonelIds: [],
    AtolyeIds: [],
    LokasyonIds: [],
  });

  React.useEffect(() => {
    if (onChange) {
      onChange("filters", filters);
    }
  }, [filters, onChange]);

  return (
    <>
      <AtolyeFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters,
          }))
        }
      />

      <PersonelFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters,
          }))
        }
      />

      <LocationFilter
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