import React from "react";
import PropTypes from "prop-types";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuInfo } from "react-icons/lu";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import BilgiKutusu from "../ortak/BilgiKutusu";
import LokasyonTablo from "../../../../../../../utils/components/LokasyonTablo";
import { bosIse } from "../../yardimcilar";

/**
 * Transfer Et: yeni lokasyon secilir ve kartin Lokasyon alanina yazilir. Kayit, kartin "Guncelle" dugmesiyle yapilir
 * (mevcut toplu lokasyon penceresi gercek bir uca baglanmadigi icin kullanilmadi).
 */
export default function TransferModali({ acik, mevcutLokasyon, onUygula, onKapat }) {
  const { t } = useTranslation();
  const methods = useForm({ defaultValues: { yeniLokasyon: null, yeniLokasyonID: null } });
  const { handleSubmit, reset } = methods;

  const kapat = () => {
    reset();
    onKapat();
  };

  const uygula = handleSubmit((veri) => {
    onUygula({ lokasyon: veri.yeniLokasyon, lokasyonID: veri.yeniLokasyonID });
    kapat();
  });

  return (
    <KartModali
      acik={acik}
      baslik={t("ekipmanKarti.genel.transferEt")}
      altBaslik={t("ekipmanKarti.genel.transferAciklama")}
      onKapat={kapat}
      altBilgi={<ModalDugmeleri onKapat={kapat} onKaydet={uygula} kaydetMetni={t("ekipmanKarti.genel.transferUygula")} />}
    >
      <FormProvider {...methods}>
        <div className="space-y-4">
          <BilgiKutusu etiket={t("ekipmanKarti.genel.mevcutLokasyon")}>{bosIse(mevcutLokasyon)}</BilgiKutusu>
          <Alan etiket={t("ekipmanKarti.genel.yeniLokasyon")} zorunlu>
            <LokasyonTablo lokasyonFieldName="yeniLokasyon" lokasyonIdFieldName="yeniLokasyonID" isRequired />
          </Alan>
          <div className="ek-kart-not">
            <LuInfo size={14} />
            <span>{t("ekipmanKarti.genel.transferNotu")}</span>
          </div>
        </div>
      </FormProvider>
    </KartModali>
  );
}

TransferModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  mevcutLokasyon: PropTypes.string,
  onUygula: PropTypes.func.isRequired,
  onKapat: PropTypes.func.isRequired,
};
