import React from "react";
import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormAlani } from "../Bilgi";
import FullDatePicker from "../../../../../utils/components/FullDatePicker";
import LokasyonTablo from "../../../../../utils/components/LokasyonTablo";

/** 1. adim: kaynak / hedef santiye, planlanan tarih, neden ve not (ust FormProvider icinde). */
export default function TransferBilgileri() {
  const { t } = useTranslation();
  const { control, watch, clearErrors } = useFormContext();

  return (
    <div className="et-modal-govde">
      <div className="et-form-izgarasi">
        <FormAlani etiket={t("ekipmanTransfer.kaynakSantiye")} zorunlu>
          <LokasyonTablo
            isRequired
            lokasyonFieldName="kaynakLokasyon"
            lokasyonIdFieldName="kaynakLokasyonID"
            workshopSelectedId={watch("kaynakLokasyonID") || undefined}
            placeholder={t("ekipmanTransfer.seciniz")}
            // LokasyonTablo degeri dogrulamadan yazar; secim yapilinca onceki "bos birakilamaz" hatasi kaldirilir.
            onSubmit={() => clearErrors("kaynakLokasyon")}
          />
        </FormAlani>
        <FormAlani etiket={t("ekipmanTransfer.hedefSantiye")} zorunlu>
          <LokasyonTablo
            isRequired
            lokasyonFieldName="hedefLokasyon"
            lokasyonIdFieldName="hedefLokasyonID"
            workshopSelectedId={watch("hedefLokasyonID") || undefined}
            placeholder={t("ekipmanTransfer.seciniz")}
            onSubmit={() => clearErrors("hedefLokasyon")}
          />
        </FormAlani>
        <FormAlani etiket={t("ekipmanTransfer.planlananTarih")} zorunlu>
          <FullDatePicker name1="planlananTarih" isRequired />
        </FormAlani>
        <FormAlani etiket={t("ekipmanTransfer.transferNedeni")}>
          <Controller name="transferNedeni" control={control} render={({ field }) => <Input {...field} />} />
        </FormAlani>
        <FormAlani etiket={t("ekipmanTransfer.aciklamaNot")} className="et-tam-satir">
          <Controller name="aciklama" control={control} render={({ field }) => <Input.TextArea {...field} rows={3} />} />
        </FormAlani>
      </div>
    </div>
  );
}
