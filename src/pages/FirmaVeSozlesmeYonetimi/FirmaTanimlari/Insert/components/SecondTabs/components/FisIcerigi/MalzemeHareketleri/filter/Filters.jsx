import React from "react";
import ConditionFilter from "./ConditionFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange }) {
  const [filters, setFilters] = React.useState({
    basTarih: null,
    bitTarih: null,
    depoId: null,
    hareketTip: "",
  });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  const containerStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap", // ekran küçükse alt satıra geçer
    alignItems: "center",
  };

  return (
    <div style={containerStyle}>
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
        onSubmit={(newFilters) =>
          setFilters((state) => ({
            ...state,
            ...newFilters,
          }))
        }
      />
    </div>
  );
}