import React from "react";
import { Select, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function GirisFiyatiSelect() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const options = [
    { value: 1, label: t("ilkAlisFiyati") },
    { value: 2, label: t("sonAlisFiyati") },
    { value: 3, label: t("ortalamaFiyat") },
    { value: 4, label: t("enYuksekFiyat") },
    { value: 5, label: t("enDusukFiyat") },
    { value: 6, label: t("sabitFiyat") },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Controller
        name="girisFiyatTuru"
        control={control}
        render={({ field }) => <Select {...field} placeholder={t("secimYapiniz")} allowClear options={options} style={{ width: "100%" }} />}
      />
    </div>
  );
}

export default GirisFiyatiSelect;
