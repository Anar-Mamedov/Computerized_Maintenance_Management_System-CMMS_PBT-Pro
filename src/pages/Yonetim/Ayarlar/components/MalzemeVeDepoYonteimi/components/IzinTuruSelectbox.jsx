import React from "react";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Option } = Select;

function IzinTuruSelectbox({ name }) {
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
        <Select {...field} defaultValue="1" style={{ width: "100%" }}>
          <Option value="1">{t("uyar")}</Option>
          <Option value="2">{t("izinVer")}</Option>
          <Option value="3">{t("engelle")}</Option>
        </Select>
      )}
    />
  );
}

export default IzinTuruSelectbox;
