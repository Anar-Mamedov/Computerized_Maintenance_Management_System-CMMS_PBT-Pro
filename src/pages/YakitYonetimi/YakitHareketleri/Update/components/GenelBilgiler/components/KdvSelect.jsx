import React from "react";
import { Select, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function KdvSelect() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const options = [
    { value: "H", label: t("haric") },
    { value: "D", label: t("dahil") },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Controller
        name="kdvSekli"
        control={control}
        render={({ field }) => <Select {...field} placeholder={t("secimYapiniz")} allowClear options={options} style={{ width: "100%" }} />}
      />
    </div>
  );
}

export default KdvSelect;
