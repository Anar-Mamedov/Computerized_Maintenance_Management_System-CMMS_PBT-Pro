import React from "react";
import PropTypes from "prop-types";
import { Button, Input } from "antd";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuDownload, LuSearch } from "react-icons/lu";
import SureFiltresi from "../../../../utils/components/SureFiltresi";
import LokasyonTablo from "../../../../utils/components/LokasyonTablo";
import EkipmanFilterSelectbox from "../../../../utils/components/EkipmanFilterSelectbox";
import SayacTipSelectbox from "../../../../utils/components/SayacTipSelectbox";
import { BOS_FILTRELER } from "../sabitler";

// LokasyonTablo secim kaldirilinca ID alanina bos dize yazar; API'ye her zaman dizi gider.
const diziyeCevir = (deger) => (Array.isArray(deger) ? deger : []);

/**
 * Arama, sure, lokasyon / ekipman / sayac tipi (coklu) filtreleri, "Indir" ve "Uygula". Filtreler yalnizca global
 * bilesenlerle kurulur; degisiklikler "Uygula" (ya da aramada Enter) ile listeye uygulanir.
 */
export default function FiltreCubugu({ onUygula, onIndir, indiriliyor }) {
  const { t } = useTranslation();
  const form = useForm({ defaultValues: { ...BOS_FILTRELER, lokasyonTanim: "" } });
  const { control, getValues } = form;

  const uygula = () => {
    const degerler = getValues();
    onUygula({
      arama: degerler.arama,
      sure: degerler.sure,
      lokasyonIds: diziyeCevir(degerler.lokasyonIds),
      ekipmanIds: diziyeCevir(degerler.ekipmanIds),
      sayacTipIds: diziyeCevir(degerler.sayacTipIds),
    });
  };

  return (
    <FormProvider {...form}>
      <div className="sh-kart sh-filtre-cubugu">
        <div className="sh-filtre sh-filtre--arama">
          <Controller
            name="arama"
            control={control}
            render={({ field }) => (
              <Input {...field} allowClear prefix={<LuSearch size={14} className="sh-soluk" />} placeholder={t("sayacHareketleri.aramaPlaceholder")} onPressEnter={uygula} />
            )}
          />
        </div>
        <div className="sh-filtre sh-filtre--sure">
          <Controller name="sure" control={control} render={({ field }) => <SureFiltresi value={field.value} onChange={field.onChange} />} />
        </div>
        <div className="sh-filtre sh-filtre--secim">
          <LokasyonTablo multiple lokasyonFieldName="lokasyonTanim" lokasyonIdFieldName="lokasyonIds" placeholder={t("sayacHareketleri.tumLokasyonlar")} />
        </div>
        <div className="sh-filtre sh-filtre--secim">
          <Controller name="ekipmanIds" control={control} render={({ field }) => <EkipmanFilterSelectbox value={field.value} onChange={field.onChange} />} />
        </div>
        <div className="sh-filtre sh-filtre--secim">
          <SayacTipSelectbox fieldName="sayacTipIds" placeholder={t("sayacHareketleri.tumSayacTipleri")} selectStyle={{ width: "100%", minWidth: 0 }} />
        </div>
        <div className="sh-filtre-dugmeleri">
          <Button icon={<LuDownload size={14} />} loading={indiriliyor} onClick={onIndir}>
            {t("indir")}
          </Button>
          <Button type="primary" onClick={uygula}>
            {t("uygula")}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}

FiltreCubugu.propTypes = {
  onUygula: PropTypes.func.isRequired,
  onIndir: PropTypes.func.isRequired,
  indiriliyor: PropTypes.bool.isRequired,
};
