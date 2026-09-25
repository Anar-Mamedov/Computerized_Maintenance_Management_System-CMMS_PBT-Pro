import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import OnayModali from "./OnayModali";
import IsEmriEkleCekmecesi from "../../../../../BakımVeArizaYonetimi/IsEmri/Insert/CreateDrawer";

/**
 * Onaydan sonra mevcut Is Emri Ekle cekmecesini, secili ekipman ve lokasyonu dolu olarak acar.
 * Alan adlari is emri formundaki makine seciminin yazdigi alanlarla aynidir.
 */
export default function IsEmriOlusturma({ satir, onKapat }) {
  const { t } = useTranslation();
  const [cekmeceAcik, setCekmeceAcik] = useState(false);

  const varsayilanDegerler = useMemo(
    () => ({
      makine: satir.MKN_KOD,
      makineID: satir.TB_MAKINE_ID,
      makineTanim: satir.MKN_TANIM,
      lokasyonID: satir.MKN_LOKASYON_ID,
      lokasyonTanim: satir.MKN_LOKASYON,
      tamLokasyonTanim: satir.MKN_LOKASYON_TUM_YOL,
      makineDurumu: satir.MKN_DURUM,
      makineDurumuID: satir.MKN_DURUM_KOD_ID,
    }),
    [satir]
  );

  if (cekmeceAcik) {
    return <IsEmriEkleCekmecesi acik onKapat={onKapat} varsayilanDegerler={varsayilanDegerler} />;
  }

  return (
    <OnayModali
      acik
      baslik={t("ekipmanListesi.islemler.isEmriOlustur")}
      soru={t("ekipmanListesi.isEmri.soru")}
      aciklama={t("ekipmanListesi.isEmri.aciklama")}
      onayMetni={t("ekipmanListesi.isEmri.onay")}
      onOnay={() => setCekmeceAcik(true)}
      onVazgec={onKapat}
    />
  );
}

IsEmriOlusturma.propTypes = {
  satir: PropTypes.shape({
    TB_MAKINE_ID: PropTypes.number.isRequired,
    MKN_KOD: PropTypes.string,
    MKN_TANIM: PropTypes.string,
    MKN_LOKASYON_ID: PropTypes.number,
    MKN_LOKASYON: PropTypes.string,
    MKN_LOKASYON_TUM_YOL: PropTypes.string,
    MKN_DURUM: PropTypes.string,
    MKN_DURUM_KOD_ID: PropTypes.number,
  }).isRequired,
  onKapat: PropTypes.func.isRequired,
};
