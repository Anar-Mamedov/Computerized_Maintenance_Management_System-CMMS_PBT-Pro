import React from "react";
import PropTypes from "prop-types";
import { Button, Input, Select } from "antd";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuSearch } from "react-icons/lu";
import FullDatePicker from "../../../../utils/components/FullDatePicker";
import LokasyonTablo from "../../../../utils/components/LokasyonTablo";
import { BOS_FILTRELER, TRANSFER_DURUMLARI } from "../sabitler";

/** Arama, tarih araligi, kaynak/hedef santiye ve durum filtreleri; "Uygula" ile listeye uygulanir. */
export default function FiltreCubugu({ onUygula }) {
  const { t } = useTranslation();
  const form = useForm({ defaultValues: BOS_FILTRELER });
  const { control, getValues, reset } = form;

  const uygula = () => onUygula(getValues());

  const temizle = () => {
    reset(BOS_FILTRELER);
    onUygula(BOS_FILTRELER);
  };

  return (
    <FormProvider {...form}>
      <div className="et-kart et-filtre-cubugu">
        <div className="et-filtre et-filtre--arama">
          <Controller
            name="arama"
            control={control}
            render={({ field }) => (
              <Input {...field} allowClear prefix={<LuSearch size={14} className="et-soluk" />} placeholder={t("ekipmanTransfer.filtre.aramaPlaceholder")} onPressEnter={uygula} />
            )}
          />
        </div>
        <div className="et-filtre et-filtre--tarih">
          <FullDatePicker name1="baslangicTarihi" placeholder={t("ekipmanTransfer.filtre.baslangic")} />
        </div>
        <span className="et-soluk">–</span>
        <div className="et-filtre et-filtre--tarih">
          <FullDatePicker name1="bitisTarihi" placeholder={t("ekipmanTransfer.filtre.bitis")} />
        </div>
        <div className="et-filtre et-filtre--lokasyon">
          <LokasyonTablo lokasyonFieldName="kaynakLokasyon" lokasyonIdFieldName="kaynakLokasyonID" placeholder={t("ekipmanTransfer.kaynakSantiye")} />
        </div>
        <div className="et-filtre et-filtre--lokasyon">
          <LokasyonTablo lokasyonFieldName="hedefLokasyon" lokasyonIdFieldName="hedefLokasyonID" placeholder={t("ekipmanTransfer.hedefSantiye")} />
        </div>
        <div className="et-filtre et-filtre--durum">
          <Controller
            name="durum"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                className="w-full"
                placeholder={t("ekipmanTransfer.filtre.durumTumu")}
                options={TRANSFER_DURUMLARI.map((durum) => ({ value: durum.id, label: t(`ekipmanTransfer.durum.${durum.key}`) }))}
              />
            )}
          />
        </div>
        <div className="et-filtre-dugmeleri">
          <Button type="primary" onClick={uygula}>
            {t("uygula")}
          </Button>
          <Button onClick={temizle}>{t("temizle")}</Button>
        </div>
      </div>
    </FormProvider>
  );
}

FiltreCubugu.propTypes = {
  onUygula: PropTypes.func.isRequired,
};
