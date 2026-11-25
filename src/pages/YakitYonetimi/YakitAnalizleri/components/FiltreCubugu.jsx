import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DonemSelectbox from "../../../../utils/components/DonemSelectbox";
import KodFilterSelectbox from "../../../../utils/components/KodFilterSelectbox";
import LokasyonTablo from "../../../../utils/components/LokasyonTablo";
import { YAKIT_TIPI_KOD_GRUBU } from "../../ortak/yakitFiltresi";

/** Dashboard filtreleri: sure, lokasyon ve yakit tipi (ortak filtre objesi, dokuman 1.1). */
export default function FiltreCubugu() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();

  return (
    <div className="flex flex-wrap items-start justify-end gap-2">
      <DonemSelectbox style={{ flex: "1 1 auto", maxWidth: 460 }} />
      <div className="w-[200px] max-w-full">
        <LokasyonTablo
          multiple
          lokasyonFieldName="lokasyonTanim"
          lokasyonIdFieldName="lokasyonIds"
          workshopSelectedId={watch("lokasyonIds") || []}
          placeholder={t("yakitAnalizleri.tumLokasyonlar")}
        />
      </div>
      <div className="w-[180px] max-w-full">
        <Controller
          name="yakitTipIds"
          control={control}
          render={({ field }) => (
            <KodFilterSelectbox kodGrubu={YAKIT_TIPI_KOD_GRUBU} placeholder={t("yakitAnalizleri.tumYakitTipleri")} value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
    </div>
  );
}
