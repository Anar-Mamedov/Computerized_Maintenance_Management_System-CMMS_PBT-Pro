import React from "react";
import { Select, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function CikisiyatiSelect() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const options = [
    { value: 1, label: t("ilkCikisFiyati") },
    { value: 2, label: t("sonCikisFiyati") },
    { value: 3, label: t("ortalamaFiyat") },
    { value: 4, label: t("enYuksekFiyat") },
    { value: 5, label: t("enDusukFiyat") },
    { value: 6, label: t("sabitFiyat") },
    { value: 7, label: t("girisFiyatiKullan") },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Controller
        name="cikisFiyatTuru"
        control={control}
        render={({ field }) => <Select {...field} placeholder={t("secimYapiniz")} allowClear options={options} style={{ width: "100%" }} />}
      />
    </div>
  );
}

export default CikisiyatiSelect;
