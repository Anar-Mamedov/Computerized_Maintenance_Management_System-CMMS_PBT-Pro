import React from "react";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import TanimFilter from "./TanimFilter";
import AtolyeFilter from "./AtolyeFilter";

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
      <TanimFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, bakimtanimlari: newFilters }))} />
      <AtolyeFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, atolyeler: newFilters }))} />
      <LocationFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} />
      <CustomFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, customfilter: newFilters }))} />
    </>
  );
}
