import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange }) {
  const [filters, setFilters] = React.useState({
    lokasyonlar: {},
    isemritipleri: {},
    durumlar: { key0: "3" },
    customfilters: {},
  });

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
      <ConditionFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, durumlar: newFilters }))} />
      <ZamanAraligi onChange={handleZamanAraligiChange} />
      {/* <LocationFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} /> */}
      <CustomFilter onSubmit={handleCustomFilterChange} />
    </>
  );
}
