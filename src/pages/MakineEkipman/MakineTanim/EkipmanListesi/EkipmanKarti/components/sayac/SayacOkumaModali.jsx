import React from "react";
import PropTypes from "prop-types";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import SayacOkumaFormu from "./SayacOkumaFormu";
import useSayacOkumaFormu from "./useSayacOkumaFormu";

/** Sayac Guncelleme: secili sayaca yeni okuma girer. Kaydedince once onKaydedildi, sonra onKapat cagrilir. */
export default function SayacOkumaModali({ acik, makineId, lokasyonId, sayac, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const { methods, kaydediliyor, kaydet } = useSayacOkumaFormu({
    acik,
    makineId,
    lokasyonId,
    sayac,
    onBasarili: () => {
      onKaydedildi();
      onKapat();
    },
  });

  return (
    <KartModali
      acik={acik}
      baslik={t("ekipmanKarti.sayac.guncelleme")}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={kaydet} kaydediliyor={kaydediliyor} />}
    >
      <FormProvider {...methods}>{sayac && <SayacOkumaFormu sayac={sayac} />}</FormProvider>
    </KartModali>
  );
}

SayacOkumaModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  makineId: PropTypes.number.isRequired,
  /** Makinenin lokasyonu (ana formdaki lokasyonID). */
  lokasyonId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sayac: PropTypes.shape({
    sayacId: PropTypes.number.isRequired,
    tanim: PropTypes.string,
    guncelDeger: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    birim: PropTypes.string,
    guncellemeSekli: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
