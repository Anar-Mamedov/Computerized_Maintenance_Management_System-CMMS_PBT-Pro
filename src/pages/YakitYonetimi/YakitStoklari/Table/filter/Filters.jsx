import React from "react";
import ConditionFilter from "./ConditionFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange, kelime }) {
  const [filters, setFilters] = React.useState({
    durumId: [],
    baslangicTarihi: null,
    bitisTarihi: null,
    kelime: kelime || "",
    FirmaID: 0,
    MalzemeID: 0
  });

  React.useEffect(() => {
      onChange("filters", filters);
  }, [filters, onChange]);
  
  React.useEffect(() => {
      setFilters((prev) => ({ ...prev, kelime: kelime }));
  }, [kelime]);

  return (
    <>
      <ConditionFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters,
          }))
        }
      />

      <ZamanAraligi
        onSubmit={(dateRange) =>
          setFilters((state) => ({
            ...state,
            ...dateRange,
          }))
        }
      />

      <CustomFilter
        onSubmit={(filterData) => {

          setFilters((state) => {
            const newState = { ...state };

            if (!filterData || filterData === "") {
               newState.FirmaID = 0;
               newState.MalzemeID = 0;
               return newState;
            }

            newState.FirmaID = filterData.Firma || 0;

            newState.MalzemeID = filterData.Malzeme || 0;

            if(filterData.baslangicTarihi) newState.baslangicTarihi = filterData.baslangicTarihi;
            if(filterData.bitisTarihi) newState.bitisTarihi = filterData.bitisTarihi;

            return newState;
          });
        }}
      />
    </>
  );
}