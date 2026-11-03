import React from "react";
import PropTypes from "prop-types";
import { t } from "i18next";
import CustomFilter from "./custom-filter/CustomFilter";
import LokasyonTablo from "../../../../../utils/components/LokasyonTablo";
import MarkaFilterSelectbox from "../../../../../utils/components/MarkaFilterSelectbox";
import ModelFilterSelectbox from "../../../../../utils/components/ModelFilterSelectbox";

export default function Filters({ onChange, onApply }) {
  const [markaIds, setMarkaIds] = React.useState([]);
  const [modelIds, setModelIds] = React.useState([]);
  const [lokasyonIds, setLokasyonIds] = React.useState([]);
  const [filters, setFilters] = React.useState({
    lokasyonlar: {},
    isemritipleri: {},
    durumlar: {},
    customfilter: {},
  });

  // Lokasyon, marka ve model seçimleri (PBT ID'leri) customfilter içine yansır
  React.useEffect(() => {
    setFilters((state) => ({
      ...state,
      customfilter: {
        ...(state.customfilter || {}),
        lokasyonIds,
        markaIds,
        modelIds,
      },
    }));
  }, [markaIds, modelIds, lokasyonIds]);

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <div style={{ width: "200px" }}>
        <LokasyonTablo
          multiple
          workshopSelectedId={lokasyonIds}
          lokasyonFieldName="lokasyonTanim"
          lokasyonIdFieldName="lokasyonIds"
          placeholder={t("lokasyon")}
          onSubmit={(secilenler) => setLokasyonIds(secilenler.map((lokasyon) => lokasyon.key))}
          onClear={() => setLokasyonIds([])}
        />
      </div>
      <div style={{ width: "150px" }}>
        <MarkaFilterSelectbox
          value={markaIds}
          onChange={(secilenMarkalar) => {
            setMarkaIds(secilenMarkalar);
            // Model marka seçilmeden seçilemez; marka kalmayınca model seçimi de boşalır.
            if (secilenMarkalar.length === 0) setModelIds([]);
          }}
        />
      </div>
      <div style={{ width: "150px" }}>
        <ModelFilterSelectbox value={modelIds} onChange={setModelIds} markaIds={markaIds} disabled={markaIds.length === 0} />
      </div>

      {/*<TypeFilter*/}
      {/*  onSubmit={(newFilters) =>*/}
      {/*    setFilters((state) => ({ ...state, isemritipleri: newFilters }))*/}
      {/*  }*/}
      {/*/>*/}
      {/*<ConditionFilter*/}
      {/*  onSubmit={(newFilters) =>*/}
      {/*    setFilters((state) => ({ ...state, durumlar: newFilters }))*/}
      {/*  }*/}
      {/*/>*/}
      {/*<LocationFilter*/}
      {/*  onSubmit={(newFilters) =>*/}
      {/*    setFilters((state) => ({ ...state, lokasyonlar: newFilters }))*/}
      {/*  }*/}
      {/*/>*/}
      {/* <ZamanAraligi /> */}
      <CustomFilter
        onSubmit={(newFilters) => {
          setFilters((state) => {
            const isEmpty = !newFilters || Object.keys(newFilters).length === 0;
            const nextCustomfilter = isEmpty
              ? { lokasyonIds, markaIds, modelIds }
              : { ...(state.customfilter || {}), ...newFilters };

            const updated = { ...state, customfilter: nextCustomfilter };
            onChange("filters", updated);
            if (onApply) onApply({ customfilterOverride: nextCustomfilter });
            return updated;
          });
        }}
      />
    </div>
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
  onApply: PropTypes.func,
};
