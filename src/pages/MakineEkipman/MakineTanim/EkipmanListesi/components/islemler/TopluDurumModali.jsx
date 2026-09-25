import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IslemModali, { FormAlani } from "./IslemModali";
import SegmentSecimi from "../SegmentSecimi";
import { yanitiBildir } from "./topluCalistir";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import { topluDurumGuncelle } from "../../ekipmanService";
import { KOD_GRUPLARI } from "../../constants";

/**
 * Secili ekipmanlarin durum kodunu ve istenirse aktifligini topluca gunceller (Ekipman/TopluDurumGuncelle).
 * Aktiflik "Degistirme" birakilirsa isAktif gonderilmez.
 */
export default function TopluDurumModali({ satirlar, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [yukleniyor, setYukleniyor] = useState(false);
  const [isAktif, setIsAktif] = useState(null);
  const methods = useForm({ defaultValues: { yeniDurum: null, yeniDurumID: null } });

  const aktiflikSecenekleri = [
    { value: null, label: t("ekipmanListesi.durumModal.degistirme") },
    { value: 1, label: t("aktif") },
    { value: 0, label: t("pasif") },
  ];

  const kaydet = methods.handleSubmit(async ({ yeniDurumID }) => {
    setYukleniyor(true);
    try {
      const response = await topluDurumGuncelle({
        makineIds: satirlar.map((satir) => satir.TB_MAKINE_ID),
        durumKodId: Number(yeniDurumID),
        isAktif,
      });
      if (yanitiBildir(response, t)) onTamamlandi();
    } catch (error) {
      console.error("Toplu durum güncellenemedi:", error);
      message.error(t("islemBasarisiz"));
    } finally {
      setYukleniyor(false);
    }
  });

  return (
    <IslemModali
      baslik={t("ekipmanListesi.durumModal.baslik")}
      aciklama={t("ekipmanListesi.durumModal.aciklama")}
      seciliAdet={satirlar.length}
      secimAciklamasi={t("ekipmanListesi.durumModal.bilgi")}
      kaydetMetni={t("ekipmanListesi.durumModal.kaydet")}
      yukleniyor={yukleniyor}
      onKaydet={kaydet}
      onKapat={onKapat}
    >
      <FormProvider {...methods}>
        <FormAlani etiket={t("ekipmanListesi.durumModal.yeniDurum")} zorunlu>
          <KodIDSelectbox name1="yeniDurum" kodID={KOD_GRUPLARI.makineDurumu} isRequired placeholder={t("ekipmanListesi.durumModal.seciniz")} />
        </FormAlani>
      </FormProvider>
      <FormAlani etiket={t("ekipmanListesi.durumModal.aktiflik")}>
        <SegmentSecimi ariaLabel={t("ekipmanListesi.durumModal.aktiflik")} secenekler={aktiflikSecenekleri} deger={isAktif} onDegistir={setIsAktif} />
      </FormAlani>
    </IslemModali>
  );
}

TopluDurumModali.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.shape({ TB_MAKINE_ID: PropTypes.number })).isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
