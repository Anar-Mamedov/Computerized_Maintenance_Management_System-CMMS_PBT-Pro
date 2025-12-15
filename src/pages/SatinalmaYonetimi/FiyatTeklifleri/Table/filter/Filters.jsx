import React from "react";
import ConditionFilter from "./ConditionFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange, TeklifNo }) {
  const [filters, setFilters] = React.useState({
    TeklifNo: TeklifNo || "",
    TalepNo: "",
    DurumId: [],
    Tedarikci: "",
    Lokasyon: "",
    Kelime: "",
  });

  React.useEffect(() => {
      onChange("filters", filters);
  }, [filters, onChange]);
  
  React.useEffect(() => {
      setFilters((prev) => ({ ...prev, TeklifNo: TeklifNo }));
  }, [TeklifNo]);

  return (
    <>
      <ConditionFilter
        onSubmit={(selectedDurumlar) => {
          setFilters((state) => ({
            ...state,
            DurumId: selectedDurumlar.durumId, 
          }));
        }}
      />

      <CustomFilter
        onSubmit={(filterData) => {
          setFilters((state) => {
            const newState = { ...state };

            if (!filterData || filterData === "") {
               newState.TalepNo = "";
               newState.Tedarikci = "";
               newState.Lokasyon = "";
               newState.Kelime = "";
               return newState;
            }

            newState.TalepNo = filterData.TalepNo || "";
            newState.Tedarikci = filterData.Tedarikci || "";
            newState.Lokasyon = filterData.Lokasyon || "";
            newState.Kelime = filterData.Kelime || "";

            if(filterData.baslangicTarihi) newState.baslangicTarihi = filterData.baslangicTarihi;
            if(filterData.bitisTarihi) newState.bitisTarihi = filterData.bitisTarihi;

            return newState;
          });
        }}
      />
    </>
  );
}