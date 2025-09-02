import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

export default function FullDatePicker({ name1, isRequired = false, pickType = null, disabled = false }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Dil ayarına göre görüntüleme formatı
  const currentLang = (localStorage.getItem("i18nextLng") || "tr").split("-")[0];
  const dateFormatMap = {
    tr: "DD.MM.YYYY",
    az: "DD.MM.YYYY",
    ru: "DD.MM.YYYY",
    en: "MM/DD/YYYY",
  };
  const displayFormat = dateFormatMap[currentLang] || "YYYY-MM-DD";

  return (
    <>
      <Controller
        name={name1}
        control={control}
        rules={{ required: isRequired ? t("alanBosBirakilamaz") : false }}
        render={({ field }) => (
          <DatePicker
            {...field}
            picker={pickType}
            format={pickType == null ? displayFormat : undefined}
            status={errors[name1] ? "error" : ""}
            style={{ flex: 1, width: "100%" }}
            disabled={disabled}
          />
        )}
      />
      {errors[name1] && <div style={{ color: "red", marginTop: "5px" }}>{errors[name1].message}</div>}
    </>
  );
}

FullDatePicker.propTypes = {
  name1: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  pickType: PropTypes.string,
};
