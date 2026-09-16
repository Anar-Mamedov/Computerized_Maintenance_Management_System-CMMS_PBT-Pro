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
  lokasyonlar: [],
  makineler: [],
  customfilters: {},
};

export default function Filters({ onChange, baslangicLokasyonIds, baslangicMakineIds, baslangicTarihi, bitisTarihi, baslangicKritik }) {
  // Filtre cekmecesinde secilebilecek alanlar (tarih araligi cekmecede sabittir).
  const filtreAlanlari = React.useMemo(
    () => [
      { value: "lokasyonlar", label: t("lokasyon"), tip: "lokasyon" },
      { value: "makineler", label: t("ekipman"), tip: "ekipman" },
      { value: "kritik", label: t("kritikMalzeme"), tip: "select", secenekler: [{ value: true, label: t("evet") }, { value: false, label: t("hayir") }] },
    ],
    []
  );

  const cekmeceBaslangici = React.useMemo(
    () => ({
      lokasyonlar: baslangicLokasyonIds,
      makineler: baslangicMakineIds,
      ...(baslangicKritik ? { kritik: true } : {}),
      startDate: baslangicTarihi,
      endDate: bitisTarihi,
    }),
    [baslangicLokasyonIds, baslangicMakineIds, baslangicKritik, baslangicTarihi, bitisTarihi]
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
        baslangicFiltreleri={cekmeceBaslangici}
        onSubmit={(cekmeceFiltreleri) =>
          setFilters((state) => ({ ...state, lokasyonlar: [], makineler: [], kritik: false, customfilters: {}, ...(cekmeceFiltreleri || {}) }))
        }
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
