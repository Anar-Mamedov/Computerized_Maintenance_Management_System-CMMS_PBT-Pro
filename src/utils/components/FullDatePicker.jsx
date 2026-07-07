import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "antd";
import azAZ from "antd/es/date-picker/locale/az_AZ";
import enUS from "antd/es/date-picker/locale/en_US";
import ruRU from "antd/es/date-picker/locale/ru_RU";
import trTR from "antd/es/date-picker/locale/tr_TR";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const getInputDigits = (event) => event?.target?.value?.replace(/\D/g, "") || "";
const datePickerLocaleMap = {
  tr: trTR,
  az: azAZ,
  ru: ruRU,
  en: enUS,
};

const parseNumericDateInput = (event, format) => {
  const digits = getInputDigits(event);

  if (digits.length !== 8) {
    return null;
  }

  const dateParts = {};
  let cursor = 0;
  const tokens = (format || "DD.MM.YYYY").match(/YYYY|MM|DD/g) || [];

  tokens.forEach((token) => {
    const length = token === "YYYY" ? 4 : 2;
    dateParts[token] = digits.slice(cursor, cursor + length);
    cursor += length;
  });

  if (cursor !== digits.length || !dateParts.DD || !dateParts.MM || !dateParts.YYYY) {
    return null;
  }

  const parsedDate = dayjs(`${dateParts.DD}.${dateParts.MM}.${dateParts.YYYY}`, "DD.MM.YYYY", true);
  return parsedDate.isValid() ? parsedDate : null;
};

export default function FullDatePicker({ name1, isRequired = false, pickType = null, disabled = false, placeholder, showError = true, rules, ...pickerProps }) {
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
  const {
    onChange: customOnChange,
    onBlur: customOnBlur,
    onKeyDown: customOnKeyDown,
    locale: customLocale,
    showNow: customShowNow,
    showToday: customShowToday,
    style: customStyle,
    ...restPickerProps
  } = pickerProps;
  const pickerLocale = customLocale || datePickerLocaleMap[currentLang] || enUS;
  const pickerTypeProps = pickType == null ? {} : { picker: pickType };

  return (
    <>
      <Controller
        name={name1}
        control={control}
        rules={{
          ...(isRequired ? { required: t("alanBosBirakilamaz") } : {}),
          ...rules,
        }}
        render={({ field }) => (
          <DatePicker
            {...field}
            {...restPickerProps}
            {...pickerTypeProps}
            format={pickType == null ? displayFormat : undefined}
            locale={pickerLocale}
            showNow={customShowNow ?? customShowToday ?? true}
            status={errors[name1] ? "error" : ""}
            style={{ flex: 1, width: "100%", ...customStyle }}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(value, dateString) => {
              field.onChange(value);
              customOnChange?.(value, dateString);
            }}
            onBlur={(event) => {
              if (pickType == null) {
                const parsedDate = parseNumericDateInput(event, displayFormat);

                if (parsedDate) {
                  field.onChange(parsedDate);
                }
              }

              field.onBlur();
              customOnBlur?.(event);
            }}
            onKeyDown={(event) => {
              customOnKeyDown?.(event);

              if (event.key !== "Enter" || event.defaultPrevented) {
                return;
              }

              event.preventDefault();
              event.stopPropagation();

              if (pickType == null) {
                const parsedDate = parseNumericDateInput(event, displayFormat);

                if (parsedDate) {
                  field.onChange(parsedDate);
                }
              }

              field.onBlur();
              event.currentTarget?.blur?.();
            }}
          />
        )}
      />
      {showError && errors[name1] && <div style={{ color: "red", marginTop: "5px" }}>{errors[name1].message}</div>}
    </>
  );
}

FullDatePicker.propTypes = {
  name1: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  pickType: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  showError: PropTypes.bool,
  rules: PropTypes.object,
};
