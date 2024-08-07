import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";

export default function Filters({ onChange }) {
  const [filters, setFilters] = React.useState({
    lokasyonlar: {},
    isemritipleri: {},
    durumlar: {},
    customfilter: {},
  });

  React.useEffect(() => {
    onChange("filters", filters.customfilter);
  }, [filters, onChange]);

  return (
    <>
      {/* <TypeFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, isemritipleri: newFilters }))} />
      <ConditionFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, durumlar: newFilters }))} />
      <LocationFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} /> */}
      <CustomFilter
        onSubmit1={(newFilters) => setFilters((state) => ({ ...state, customfilter: newFilters }))}
        isEmpty={!Object.keys(filters.customfilter).length}
      />
    </>
  );
}
