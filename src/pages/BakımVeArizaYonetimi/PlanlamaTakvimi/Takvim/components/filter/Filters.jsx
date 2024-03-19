import React from "react";

import CustomFilter from "./custom-filter/CustomFilter";

export default function Filtereler({ onChange }) {
  const [filters, setFilters] = React.useState({
    // lokasyonlar: {},
    // isemritipleri: {},
    // durumlar: {},
    customfilters: {},
  });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <CustomFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, customfilters: newFilters }))} />
    </div>
  );
}
