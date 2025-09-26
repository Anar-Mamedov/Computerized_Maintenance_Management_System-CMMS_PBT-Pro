import React from "react";
import { InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

export default function NumberInput({ name1, isRequired, minNumber, maxNumber, readOnly, disabled = false }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Get language from localStorage
  const currentLang = localStorage.getItem("i18nextLng") || "en";

  // Define decimal and thousand separators based on language
  const separators = {
    tr: { decimal: ",", thousand: "." },
    en: { decimal: ".", thousand: "," },
    ru: { decimal: ",", thousand: " " },
    az: { decimal: ",", thousand: "." },
  };

  const { decimal, thousand } = separators[currentLang] || separators.en;

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
            formatter={(value) => {
              if (!value) return "";
              // Convert to string and split at decimal point
              const [integerPart, decimalPart] = value.toString().split(".");
              // Format integer part with thousand separator
              const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
              // Return formatted number with appropriate decimal separator
              return decimalPart ? `${formattedInteger}${decimal}${decimalPart}` : formattedInteger;
            }}
            parser={(value) => {
              if (!value) return "";
              // Remove thousand separators and convert decimal separator to standard format
              return value.replace(new RegExp(`\\${thousand}`, "g"), "").replace(decimal, ".");
            }}
            step="0.01"
          />
        )}
      />
      {errors[name1] && <div style={{ color: "red", marginTop: "5px" }}>{errors[name1].message}</div>}
    </>
  );
}
