import React from "react";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Option } = Select;

function KilometreGuncellemesiSelectbox() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name="guncellemeTipi"
      control={control}
      render={({ field }) => (
        <Select {...field} defaultValue="1" style={{ width: "100%" }}>
          <Option value="1">{t("ilkAlis")}</Option>
          <Option value="2">{t("ortalama")}</Option>
          <Option value="3">{t("sonAlis")}</Option>
        </Select>
      )}
    />
  );
}

export default KilometreGuncellemesiSelectbox;
