import React from "react";
import PropTypes from "prop-types";
import ConditionFilter from "./ConditionFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";
import UserStatusFilter from "./UserStatusFilter";

export default function Filters({ onChange, hatirlaticiGrupId, hatirlaticiSiraId }) {
  const [filters, setFilters] = React.useState(() => {
    const initialDurumlar = (Number(hatirlaticiGrupId) === 2 && Number(hatirlaticiSiraId) === 1)
      ? { key0: "1" }
      : {};
    return {
      lokasyonlar: {},
      isemritipleri: {},
      durumlar: initialDurumlar,
      onayDurumlari: {},
      customfilters: {},
    };
  });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <>
      {/* <TypeFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, isemritipleri: newFilters }))} /> */}
      <ConditionFilter 
        onSubmit={(newFilters) => setFilters((state) => ({ ...state, durumlar: newFilters }))} 
        hatirlaticiGrupId={hatirlaticiGrupId}
        hatirlaticiSiraId={hatirlaticiSiraId}
      />
      <UserStatusFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, onayDurumlari: newFilters }))} />
      <ZamanAraligi />
      {/* <LocationFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} /> */}
      <CustomFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, customfilters: newFilters }))} />
    </>
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
  hatirlaticiGrupId: PropTypes.any,
  hatirlaticiSiraId: PropTypes.any,
};
