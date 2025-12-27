import React from "react";
import { InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

export default function ValidationNumberInput({ name1, isRequired, minNumber, maxNumber, readOnly, disabled = false, validationColor }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const currentLang = localStorage.getItem("i18nextLng") || "en";

  const separators = {
    tr: { decimal: ",", thousand: "." },
    en: { decimal: ".", thousand: "," },
    ru: { decimal: ",", thousand: " " },
    az: { decimal: ",", thousand: "." },
  };

  const { decimal, thousand } = separators[currentLang] || separators.en;

  const getInputStyle = () => {
    const baseStyle = { width: "100%" };

    if (validationColor === "green") {
      return {
        ...baseStyle,
        borderColor: "#52c41a",
        boxShadow: "0 0 0 2px rgba(82, 196, 26, 0.2)",
      };
    }

    if (validationColor === "red" || errors[name1]) {
      return {
        ...baseStyle,
        borderColor: "#ff4d4f",
        boxShadow: "0 0 0 2px rgba(255, 77, 79, 0.2)",
      };
    }

    return baseStyle;
  };

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
            status={errors[name1] || validationColor === "red" ? "error" : ""}
            style={getInputStyle()}
            readOnly={readOnly ? true : false}
            disabled={disabled}
            formatter={(value) => {
              if (!value) return "";
              const [integerPart, decimalPart] = value.toString().split(".");
              const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
              return decimalPart ? `${formattedInteger}${decimal}${decimalPart}` : formattedInteger;
            }}
            parser={(value) => {
              if (!value) return "";
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
