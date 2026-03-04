import React from "react";
import CustomFilter from "./custom-filter/CustomFilter";

export default function Filters({ onChange }) {
  const emptyFilters = {
    stkTipIds: [],
    stkDepoIds: [],
    stkGrupIds: [],
  };

  const [filters, setFilters] = React.useState({
    ...emptyFilters,
  });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <>
      <CustomFilter
        onSubmit={(newFilters) =>
          setFilters({
            ...emptyFilters,
            ...(newFilters || {}),
          })
        }
      />
    </>
  );
}
