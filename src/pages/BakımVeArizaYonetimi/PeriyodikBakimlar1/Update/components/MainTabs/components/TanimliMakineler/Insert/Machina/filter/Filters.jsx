import React from "react";
import ConditionFilter from "./ConditionFilter.jsx";
import LocationFilter from "./LocationFilter.jsx";
import TypeFilter from "./TypeFilter.jsx";
import CustomFilter from "./custom-filter/CustomFilter.jsx";

export default function Filters({ onChange }) {
  const [filters, setFilters] = React.useState({
    // lokasyonlar: {},
    // isemritipleri: {},
    // durumlar: {},
    customfilters: {},
  });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* <TypeFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, isemritipleri: newFilters }))} /> */}
      {/* <ConditionFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, durumlar: newFilters }))} /> */}
      {/* <LocationFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} /> */}
      <CustomFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({ ...state, customfilters: newFilters }))
        }
      />
    </div>
  );
}
