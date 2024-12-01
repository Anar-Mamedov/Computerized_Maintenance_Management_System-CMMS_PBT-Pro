import React from "react";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Option } = Select;

function Selectbox({ name, disabled }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select {...field} disabled={disabled} defaultValue="1" style={{ width: "100%" }}>
          <Option value="1">{t("uyar")}</Option>
          <Option value="2">{t("izinVerme")}</Option>
        </Select>
      )}
    />
  );
}

export default Selectbox;
