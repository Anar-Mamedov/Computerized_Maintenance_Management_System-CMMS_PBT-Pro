import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

const DEFAULT_STATUS_KEYS = ["3"];

const normalizeStatusKeys = (keys) => {
  if (!Array.isArray(keys) || keys.length === 0) {
    return DEFAULT_STATUS_KEYS;
  }
  return keys.map((key) => key.toString());
};

const buildDurumlarFilter = (keys) =>
  normalizeStatusKeys(keys).reduce((acc, key, index) => {
    acc[`key${index}`] = key;
    return acc;
  }, {});

export default function Filters({ onChange, defaultStatusKeys = DEFAULT_STATUS_KEYS }) {
  const resolvedStatusKeys = React.useMemo(() => normalizeStatusKeys(defaultStatusKeys), [defaultStatusKeys]);
  const defaultDurumlarFilter = React.useMemo(() => buildDurumlarFilter(resolvedStatusKeys), [resolvedStatusKeys]);

  const [filters, setFilters] = React.useState({
    lokasyonlar: {},
    isemritipleri: {},
    durumlar: defaultDurumlarFilter,
    customfilters: {},
  });

  React.useEffect(() => {
    setFilters((state) => {
      if (JSON.stringify(state.durumlar) === JSON.stringify(defaultDurumlarFilter)) {
        return state;
      }

      return {
        ...state,
        durumlar: defaultDurumlarFilter,
      };
    });
  }, [defaultDurumlarFilter]);

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  const handleZamanAraligiChange = (zamanFilters) => {
    setFilters((state) => {
      let updatedCustomFilters = { ...state.customfilters };

      // "Tümü" seçeneği seçildiğinde tarih filtrelerini kaldır
      if (zamanFilters.customfilters && zamanFilters.customfilters.removeDateFilters) {
        // removeDateFilters özelliğini filtreleme objemizden silelim
        const { removeDateFilters, ...restCustomFilters } = zamanFilters.customfilters;

        // startDate ve endDate özelliklerini mevcut customfilters'dan kaldıralım
        const { startDate, endDate, ...restStateCustomFilters } = updatedCustomFilters;

        // Güncellenmiş customfilters'ı diğer filtrelerle birleştirelim
        updatedCustomFilters = {
          ...restStateCustomFilters,
          ...restCustomFilters,
        };
      } else {
        // Normal durum: Yeni filtreleri mevcut filterlarla birleştir
        updatedCustomFilters = {
          ...updatedCustomFilters,
          ...zamanFilters.customfilters,
        };
      }

      return {
        ...state,
        customfilters: updatedCustomFilters,
      };
    });
  };

  const handleCustomFilterChange = (customFilters) => {
    setFilters((state) => ({
      ...state,
      customfilters: {
        ...state.customfilters,
        ...customFilters,
      },
    }));
  };

  return (
    <>
      {/* <TypeFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, isemritipleri: newFilters }))} /> */}
      <ConditionFilter
        defaultStatusKeys={resolvedStatusKeys}
        onSubmit={(newFilters) => setFilters((state) => ({ ...state, durumlar: newFilters }))}
      />
      <ZamanAraligi onChange={handleZamanAraligiChange} />
      {/* <LocationFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} /> */}
      <CustomFilter onSubmit={handleCustomFilterChange} />
    </>
  );
}
