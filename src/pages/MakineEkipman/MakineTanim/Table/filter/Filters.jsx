import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import MachineTypeFilter from "./MachineTypeFilter";
import CategoryFilter from "./CategoryFilter";
import StatusFilter from "./StatusFilter";
import PropTypes from "prop-types";
import { t } from "i18next";
import FiltreCekmecesi from "../../../../../utils/components/FiltreCekmecesi";

export default function Filters({ onChange, baslangicFiltreleri }) {
  // Cekmecede secilebilecek alanlar; tarih araligi cekmecede sabittir.
  const filtreAlanlari = React.useMemo(
    () => [
      { value: "atolye", label: t("atolye"), tip: "atolye" },
      { value: "makineler", label: t("ekipman"), tip: "ekipman" },
      { value: "arizali", label: t("arizali"), tip: "select", secenekler: [{ value: true, label: t("evet") }, { value: false, label: t("hayir") }] },
    ],
    []
  );

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
      <LocationFilter baslangicIds={baslangicFiltreleri?.lokasyonlar} onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} />
      <MachineTypeFilter baslangicIds={baslangicFiltreleri?.makinetip} onSubmit={(newFilters) => setFilters((state) => ({ ...state, makinetip: newFilters }))} />
      <CategoryFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, kategori: newFilters }))} />
      <StatusFilter onSubmit={(value) => onChange("isActive", value)} />
      {/* <TypeFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, isemritipleri: newFilters }))} /> */}
      {/* <ConditionFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, durumlar: newFilters }))} /> */}
      <CustomFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, customfilters: newFilters }))} />
      {/* Filtre cekmecesi solda, diger filtrelerin yaninda durur. */}
      <FiltreCekmecesi
        alanlar={filtreAlanlari}
        tarihAraligiGoster={false}
        baslangicFiltreleri={baslangicFiltreleri}
        onSubmit={(cekmeceFiltreleri) => setFilters((state) => ({ ...state, atolye: [], makineler: [], arizali: undefined, ...(cekmeceFiltreleri || {}) }))}
      />
    </>
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
  baslangicFiltreleri: PropTypes.object,
};
