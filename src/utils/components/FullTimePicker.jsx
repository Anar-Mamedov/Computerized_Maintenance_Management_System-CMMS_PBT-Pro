import React from "react";
import PropTypes from "prop-types";
import { TimePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

export default function FullTimePicker({ name1, isRequired = false, disabled = false, format }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const currentLang = (localStorage.getItem("i18nextLng") || "tr").split("-")[0];
  const timeFormatMap = {
    tr: "HH:mm",
    az: "HH:mm",
    ru: "HH:mm",
    en: "hh:mm A",
  };
  const displayFormat = format || timeFormatMap[currentLang] || "HH:mm";

  return (
    <>
      <Controller
        name={name1}
        control={control}
        rules={{ required: isRequired ? t("alanBosBirakilamaz") : false }}
        render={({ field }) => (
          <TimePicker {...field} format={displayFormat} needConfirm={false} status={errors[name1] ? "error" : ""} style={{ flex: 1, width: "100%" }} disabled={disabled} />
        )}
      />
      {errors[name1] && <div style={{ color: "red", marginTop: "5px" }}>{errors[name1].message}</div>}
    </>
  );
}

FullTimePicker.propTypes = {
  name1: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
};
