import React from "react";
import PropTypes from "prop-types";
import ConditionFilter from "./ConditionFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";
import UserStatusFilter from "./UserStatusFilter";

/**
 * Filtreler cekmecesinde lokasyon ve ekipman ID bazli secildigi icin bu ikisi
 * serbest metin filtreleriyle ayni yere degil, liste API'sinin kok seviyesindeki
 * `lokasyonlar` / `makineler` alanlarina yazilir.
 */
const customFiltreyiAyikla = (drawerFiltreleri) => {
  const { lokasyonlar, makineler, ...serbestMetinler } = drawerFiltreleri || {};

  return {
    lokasyonlar: lokasyonlar || [],
    makineler: makineler || [],
    customfilters: serbestMetinler,
  };
};

export default function Filters({ onChange, hatirlaticiGrupId, hatirlaticiSiraId, baslangicDurumIds, baslangicLokasyonIds, baslangicMakineIds }) {
  const [filters, setFilters] = React.useState(() => {
    const initialDurumlar = (Number(hatirlaticiGrupId) === 2 && Number(hatirlaticiSiraId) === 1)
      ? { key0: "1" }
      : {};
    return {
      lokasyonlar: [],
      makineler: [],
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
        baslangicDurumIds={baslangicDurumIds}
      />
      <UserStatusFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, onayDurumlari: newFilters }))} />
      <ZamanAraligi />

      <CustomFilter
        onSubmit={(newFilters) => setFilters((state) => ({ ...state, ...customFiltreyiAyikla(newFilters) }))}
        baslangicLokasyonIds={baslangicLokasyonIds}
        baslangicMakineIds={baslangicMakineIds}
      />
    </>
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
  hatirlaticiGrupId: PropTypes.any,
  hatirlaticiSiraId: PropTypes.any,
  baslangicDurumIds: PropTypes.array,
  baslangicLokasyonIds: PropTypes.array,
  baslangicMakineIds: PropTypes.array,
};
