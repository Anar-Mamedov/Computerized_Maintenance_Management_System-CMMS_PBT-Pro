import React from "react";
import { InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import { formatNumberWithSeparators, getNumberSeparatorsByLanguage, parseLocalizedNumber } from "../numberLocale";

export default function NumberInput({ name1, isRequired, minNumber, maxNumber, readOnly, disabled = false }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Get language from localStorage
  const currentLang = localStorage.getItem("i18nextLng") || "en";
  const { decimal } = getNumberSeparatorsByLanguage(currentLang);

  return (
    <>
      <Controller
        name={name1}
        control={control}
        rules={{ required: isRequired ? t("alanBosBirakilamaz") : false }}
        render={({ field }) => (
          <InputNumber
            {...field}
            min={minNumber}
            {...(maxNumber !== undefined && { max: maxNumber })}
            status={errors[name1] ? "error" : ""}
            style={{ width: "100%" }}
            readOnly={readOnly ? true : false}
            disabled={disabled}
            formatter={(value) => formatNumberWithSeparators(value, currentLang)}
            parser={(value) => parseLocalizedNumber(value, currentLang)}
            decimalSeparator={decimal}
            step="0.01"
          />
        )}
      />
      {errors[name1] && <div style={{ color: "red", marginTop: "5px" }}>{errors[name1].message}</div>}
    </>
  );
}
