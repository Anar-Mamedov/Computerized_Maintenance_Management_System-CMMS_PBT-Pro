import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import MachineTypeFilter from "./MachineTypeFilter";
import CategoryFilter from "./CategoryFilter";
import StatusFilter from "./StatusFilter";

export default function Filters({ onChange }) {
  const [filters, setFilters] = React.useState({
    lokasyonlar: [],
    isemritipleri: {},
    durumlar: {},
    customfilter: {},
    makinetip: [],
    kategori: [],
  });

  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <>
      <LocationFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} />
      <MachineTypeFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, makinetip: newFilters }))} />
      <CategoryFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, kategori: newFilters }))} />
      <StatusFilter onSubmit={(value) => onChange("isActive", value)} />
      {/* <TypeFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, isemritipleri: newFilters }))} /> */}
      {/* <ConditionFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, durumlar: newFilters }))} /> */}
      <CustomFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, customfilters: newFilters }))} />
    </>
  );
}
