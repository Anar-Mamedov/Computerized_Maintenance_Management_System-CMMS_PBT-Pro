import React from "react";
import PropTypes from "prop-types";
import { TimePicker } from "antd";
import azAZ from "antd/es/time-picker/locale/az_AZ";
import enUS from "antd/es/time-picker/locale/en_US";
import ruRU from "antd/es/time-picker/locale/ru_RU";
import trTR from "antd/es/time-picker/locale/tr_TR";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import dayjs from "dayjs";

const getInputDigits = (event) => event?.target?.value?.replace(/\D/g, "") || "";
const timePickerLocaleMap = {
  tr: trTR,
  az: azAZ,
  ru: ruRU,
  en: enUS,
};

const parseNumericTimeInput = (event) => {
  const digits = getInputDigits(event);

  if (digits.length < 1 || digits.length > 4) {
    return null;
  }

  const paddedDigits = digits.length <= 2 ? digits.padStart(2, "0") : digits.padStart(4, "0");
  const hour = Number(digits.length <= 2 ? paddedDigits : paddedDigits.slice(0, 2));
  const minute = Number(digits.length <= 2 ? 0 : paddedDigits.slice(2, 4));

  if (hour > 23 || minute > 59) {
    return null;
  }

  return dayjs().hour(hour).minute(minute).second(0).millisecond(0);
};

export default function FullTimePicker({ name1, isRequired = false, disabled = false, format, showError = true, rules, ...pickerProps }) {
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
  const {
    onChange: customOnChange,
    onBlur: customOnBlur,
    onKeyDown: customOnKeyDown,
    locale: customLocale,
    showNow: customShowNow,
    style: customStyle,
    ...restPickerProps
  } = pickerProps;
  const pickerLocale = customLocale || timePickerLocaleMap[currentLang] || enUS;

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
          <TimePicker
            {...field}
            {...restPickerProps}
            format={displayFormat}
            locale={pickerLocale}
            needConfirm={false}
            showNow={customShowNow ?? true}
            status={errors[name1] ? "error" : ""}
            style={{ flex: 1, width: "100%", ...customStyle }}
            disabled={disabled}
            onChange={(value, timeString) => {
              field.onChange(value);
              customOnChange?.(value, timeString);
            }}
            onBlur={(event) => {
              const parsedTime = parseNumericTimeInput(event);

              if (parsedTime) {
                field.onChange(parsedTime);
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

              const parsedTime = parseNumericTimeInput(event);

              if (parsedTime) {
                field.onChange(parsedTime);
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

FullTimePicker.propTypes = {
  name1: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  showError: PropTypes.bool,
  rules: PropTypes.object,
};
