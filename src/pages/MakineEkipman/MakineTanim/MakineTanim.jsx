import React from "react";
import PropTypes from "prop-types";
import MainTable from "./Table/Table";
import { FormProvider, useForm } from "react-hook-form";
import EkipmanListesi from "./EkipmanListesi/EkipmanListesi";

export default function PersonelTanimlari({ hatirlaticiGrupId, hatirlaticiSiraId }) {
  const formMethods = useForm();

  // /makine rotasi yeni Ekipman Listesi ekranini acar. Hatirlatici paneli ise kendi ucunu
  // (GetMakineFullListHatirlatici) kullandigi icin mevcut tabloyla calismaya devam eder.
  if (!hatirlaticiGrupId) {
    return <EkipmanListesi />;
  }

  return (
    <FormProvider {...formMethods}>
      <div>
        <MainTable hatirlaticiGrupId={hatirlaticiGrupId} hatirlaticiSiraId={hatirlaticiSiraId} />
      </div>
    </FormProvider>
  );
}

PersonelTanimlari.propTypes = {
  hatirlaticiGrupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hatirlaticiSiraId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
