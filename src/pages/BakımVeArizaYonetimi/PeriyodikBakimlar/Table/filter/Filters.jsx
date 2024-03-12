import React from "react";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";

export default function Filters({ onChange }) {
  const [filters, setFilters] = React.useState({
    lokasyonlar: {},
    bakimtipleri: {},
    bakimgruplar: {},
    atolyeler: {},
  });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <>
      <TypeFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, bakimtipleri: newFilters }))} />
      <LocationFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} />
    </>
  );
}
