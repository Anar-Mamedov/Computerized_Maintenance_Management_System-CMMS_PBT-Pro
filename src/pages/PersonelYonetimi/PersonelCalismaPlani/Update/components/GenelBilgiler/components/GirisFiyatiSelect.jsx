import React from "react";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function GirisFiyatiSelect() {
  const { control, setValue, watch } = useFormContext();

  const analizVerileri = {
    1: watch("ilkAlisFiyati"),
    2: watch("sonAlisFiyati"),
    3: watch("ortalamaFiyat"),
    4: watch("enYuksekFiyat"),
    5: watch("enDusukFiyat"),
  };

  const options = [
    { value: 1, label: t("ilkAlisFiyati") },
    { value: 2, label: t("sonAlisFiyati") },
    { value: 3, label: t("ortalamaFiyat") },
    { value: 4, label: t("enYuksekFiyat") },
    { value: 5, label: t("enDusukFiyat") },
    { value: 6, label: t("sabitFiyat") },
  ];

  const handleSelectChange = (val, field) => {
    field.onChange(val); // RHF state güncellemesi

    if (val !== 6 && analizVerileri[val] !== undefined) {
      // shouldValidate: true yaparak kdv/tutar hesaplamaları varsa tetiklenmesini sağlarız
      setValue("girisFiyati", analizVerileri[val], { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <Controller
      name="girisFiyatTuru"
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          value={field.value || undefined} // 0 veya null ise placeholder görünsün
          placeholder={t("secimYapiniz")}
          allowClear
          options={options}
          style={{ width: "100%" }}
          onChange={(val) => handleSelectChange(val, field)}
        />
      )}
    />
  );
}

export default GirisFiyatiSelect;