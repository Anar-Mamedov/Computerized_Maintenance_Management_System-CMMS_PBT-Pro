import React from "react";
import PropTypes from "prop-types";
// import ConditionFilter from "./ConditionFilter";
// import LocationFilter from "./LocationFilter";
// import TypeFilter from "./TypeFilter";
// import CustomFilter from "./custom-filter/CustomFilter";
// import ZamanAraligi from "./ZamanAraligi";
import KodFilterSelectbox from "../../../../../utils/components/KodFilterSelectbox";
import LastikMarka from "../../../components/LastikMarka";
import LastikModel from "../../../components/LastikModel";
import { t } from "i18next";

// PBT kod listesi grupları: LASTİK TİPLERİ ve LASTİK EBATLARI
const LASTIK_TIP_KOD_GRUBU = 35500;
const LASTIK_EBAT_KOD_GRUBU = 35501;

export default function Filters({ onChange }) {
  const [markaIds, setMarkaIds] = React.useState([]);
  const [modelIds, setModelIds] = React.useState([]);
  const [tipIds, setTipIds] = React.useState([]);
  const [ebatIds, setEbatIds] = React.useState([]);
  const [filters, setFilters] = React.useState({
    /* lokasyonlar: {},
    isemritipleri: {},
    durumlar: {},
    customfilter: {}, */
  });

  // Marka ve model seçimleri değiştiğinde filtrelere yansıt
  React.useEffect(() => {
    setFilters((state) => ({
      ...state,
      markaIds: Array.isArray(markaIds) ? markaIds : [],
      modelIds: Array.isArray(modelIds) ? modelIds : [],
      tipIds: Array.isArray(tipIds) ? tipIds : [],
      ebatIds: Array.isArray(ebatIds) ? ebatIds : [],
    }));
  }, [markaIds, modelIds, tipIds, ebatIds]);

  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }}>
        <LastikMarka name1={"marka"} isRequired={false} placeholder={t("marka")} onChange={setMarkaIds} dropdownWidth="300px" inputWidth="150px" multiSelect={true} />
        <LastikModel
          name1={"model"}
          isRequired={false}
          placeholder={t("model")}
          onChange={setModelIds}
          dropdownWidth="300px"
          inputWidth="150px"
          lastikMarkaId={markaIds}
          multiSelect={true}
        />
        <div style={{ width: "150px", flexShrink: 0 }}>
          <KodFilterSelectbox kodGrubu={LASTIK_TIP_KOD_GRUBU} placeholder={t("tip")} value={tipIds} onChange={setTipIds} />
        </div>
        <div style={{ width: "150px", flexShrink: 0 }}>
          <KodFilterSelectbox kodGrubu={LASTIK_EBAT_KOD_GRUBU} placeholder={t("ebat")} value={ebatIds} onChange={setEbatIds} />
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
        {/* <CustomFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, customfilter: newFilters }))} /> */}
      </div>
    </>
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
};
