import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IslemModali, { FormAlani } from "./IslemModali";
import { yanitiBildir } from "./topluCalistir";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import { topluTipGuncelle } from "../../ekipmanService";
import { KOD_GRUPLARI } from "../../constants";

/** Secili ekipmanlarin tipini tek istekle degistirir (Ekipman/TopluTipGuncelle). */
export default function TopluTipModali({ satirlar, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [yukleniyor, setYukleniyor] = useState(false);
  const methods = useForm({ defaultValues: { yeniTip: null, yeniTipID: null } });

  const kaydet = methods.handleSubmit(async ({ yeniTipID }) => {
    setYukleniyor(true);
    try {
      const makineIds = satirlar.map((satir) => satir.TB_MAKINE_ID);
      const response = await topluTipGuncelle(makineIds, Number(yeniTipID));
      if (yanitiBildir(response, t)) onTamamlandi();
    } catch (error) {
      console.error("Toplu tip güncellenemedi:", error);
      message.error(t("islemBasarisiz"));
    } finally {
      setYukleniyor(false);
    }
  });

  return (
    <IslemModali
      baslik={t("ekipmanListesi.tip.baslik")}
      aciklama={t("ekipmanListesi.tip.aciklama")}
      seciliAdet={satirlar.length}
      secimAciklamasi={t("ekipmanListesi.tip.bilgi")}
      kaydetMetni={t("ekipmanListesi.tip.kaydet")}
      yukleniyor={yukleniyor}
      onKaydet={kaydet}
      onKapat={onKapat}
    >
      <FormProvider {...methods}>
        <FormAlani etiket={t("ekipmanListesi.tip.yeniTip")} zorunlu>
          <KodIDSelectbox name1="yeniTip" kodID={KOD_GRUPLARI.makineTipi} isRequired placeholder={t("ekipmanListesi.tip.seciniz")} />
        </FormAlani>
      </FormProvider>
    </IslemModali>
  );
}

TopluTipModali.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.shape({ TB_MAKINE_ID: PropTypes.number })).isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
