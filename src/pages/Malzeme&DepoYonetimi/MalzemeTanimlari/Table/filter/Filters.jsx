import React from "react";
import PropTypes from "prop-types";
import CustomFilter from "./custom-filter/CustomFilter";
import FilterDrawer from "./FilterDrawer";

// Bilesen disinda tanimli; her renderda yeni referans uretip efekti tetiklemesin.
const EMPTY_FILTERS = {
  stkTipIds: [],
  stkDepoIds: [],
  stkGrupIds: [],
  lokasyonlar: [],
  makineler: [],
  customfilters: {},
};

export default function Filters({ onChange, baslangicLokasyonIds, baslangicMakineIds, baslangicTarihi, bitisTarihi, baslangicKritik }) {
  const [filters, setFilters] = React.useState({ ...EMPTY_FILTERS });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <>
      {/* Toolbar'da kalan hizli secimler */}
      <CustomFilter
        onSubmit={({ stkTipIds = [], stkDepoIds = [], stkGrupIds = [] } = {}) => setFilters((state) => ({ ...state, stkTipIds, stkDepoIds, stkGrupIds }))}
      />

      {/* Cekmecedeki filtreler: lokasyon, ekipman, tarih araligi, kritik malzeme */}
      <FilterDrawer
        baslangicLokasyonIds={baslangicLokasyonIds}
        baslangicMakineIds={baslangicMakineIds}
        baslangicTarihi={baslangicTarihi}
        bitisTarihi={bitisTarihi}
        baslangicKritik={baslangicKritik}
        onSubmit={(drawerFiltreleri) => setFilters((state) => ({ ...state, ...(drawerFiltreleri || {}) }))}
      />
    </>
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
  baslangicLokasyonIds: PropTypes.array,
  baslangicMakineIds: PropTypes.array,
  baslangicTarihi: PropTypes.string,
  bitisTarihi: PropTypes.string,
  baslangicKritik: PropTypes.bool,
};
