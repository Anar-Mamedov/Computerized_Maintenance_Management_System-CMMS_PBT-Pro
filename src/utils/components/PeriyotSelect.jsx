import React from "react";
import { Select, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function PeriyotSelect({ name1 }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const options = [
    { value: 1, label: t("gun") },
    { value: 2, label: t("hafta") },
    { value: 3, label: t("ay") },
    { value: 4, label: t("yil") },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Controller
        name={name1}
        control={control}
        render={({ field }) => <Select {...field} placeholder={t("secimYapiniz")} allowClear options={options} style={{ width: "100%" }} />}
      />
    </div>
  );
}

export default PeriyotSelect;
