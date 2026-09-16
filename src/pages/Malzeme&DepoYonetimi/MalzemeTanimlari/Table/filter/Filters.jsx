import React from "react";
import PropTypes from "prop-types";
import CustomFilter from "./custom-filter/CustomFilter";
import { t } from "i18next";
import FiltreCekmecesi from "../../../../../utils/components/FiltreCekmecesi";

// Bilesen disinda tanimli; her renderda yeni referans uretip efekti tetiklemesin.
const EMPTY_FILTERS = {
  stkTipIds: [],
  stkDepoIds: [],
  stkGrupIds: [],
};

export default function Filters({ onChange, baslangicKritik, baslangicStoktaYok }) {
  // Filtre cekmecesinde secilebilecek alanlar (tarih araligi cekmecede sabittir).
  // Rehber dökümanında stok listesi lokasyon/ekipman/tarih filtresi almıyor; yalnızca kritik seviye var.
  const filtreAlanlari = React.useMemo(
    () => [
      { value: "kritik", label: t("kritikMalzeme"), tip: "select", secenekler: [{ value: true, label: t("evet") }, { value: false, label: t("hayir") }] },
      { value: "stoktaYok", label: t("stoktaYok"), tip: "select", secenekler: [{ value: true, label: t("evet") }, { value: false, label: t("hayir") }] },
    ],
    []
  );

  const cekmeceBaslangici = React.useMemo(
    () => ({ ...(baslangicKritik ? { kritik: true } : {}), ...(baslangicStoktaYok ? { stoktaYok: true } : {}) }),
    [baslangicKritik, baslangicStoktaYok]
  );

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

      {/* Cekmecedeki filtreler: tarih araligi sabit, digerleri "Filtre ekle" satirlarinda */}
      <FiltreCekmecesi
        alanlar={filtreAlanlari}
        tarihAraligiGoster={false}
        baslangicFiltreleri={cekmeceBaslangici}
        onSubmit={(cekmeceFiltreleri) => setFilters((state) => ({ ...state, kritik: false, stoktaYok: false, ...(cekmeceFiltreleri || {}) }))}
      />
    </>
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
  baslangicKritik: PropTypes.bool,
  baslangicStoktaYok: PropTypes.bool,
};
