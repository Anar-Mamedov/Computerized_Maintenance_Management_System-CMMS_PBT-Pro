import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import CustomFilter from "./custom-filter/CustomFilter";
import ZamanAraligi from "./ZamanAraligi";

/**
 * Ekipman cekmecede ID bazli secildigi icin serbest metin filtreleriyle ayni yere degil,
 * liste API'sinin kok seviyesindeki `makineler` alanina yazilir.
 */
const customFiltreyiAyikla = (drawerFiltreleri) => {
  const { makineler, atolyeler, nedenler, personeller, ...serbestMetinler } = drawerFiltreleri || {};

  return {
    makineler: makineler || [],
    atolyeler: atolyeler || [],
    nedenler: nedenler || [],
    personeller: personeller || [],
    customfilter: serbestMetinler,
  };
};

export default function Filters({ onChange, baslangicLokasyonIds, baslangicIdFiltreleri }) {
  const [filters, setFilters] = React.useState({
    lokasyonlar: {},
    isemritipleri: {},
    durumlar: {},
    customfilter: {},
  });

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <>
      <TypeFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({ ...state, isemritipleri: newFilters }))
        }
      />
      <ConditionFilter
        onSubmit={(newFilters) =>
          setFilters((state) => ({ ...state, durumlar: newFilters }))
        }
      />
      <LocationFilter
        baslangicIds={baslangicLokasyonIds}
        onSubmit={(newFilters) =>
          setFilters((state) => ({ ...state, lokasyonlar: newFilters }))
        }
      />
      <ZamanAraligi />
      <CustomFilter
        baslangicIdFiltreleri={baslangicIdFiltreleri}
        onSubmit={(newFilters) =>
          setFilters((state) => ({ ...state, ...customFiltreyiAyikla(newFilters) }))
        }
      />
    </>
  );
}
