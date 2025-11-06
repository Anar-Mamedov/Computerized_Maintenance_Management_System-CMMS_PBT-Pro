import React, { useMemo } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useTranslation } from "react-i18next";

import "dayjs/locale/tr";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import "dayjs/locale/az";

dayjs.extend(localizedFormat);

const toDayjsInstance = (input) => {
  if (!input) {
    return null;
  }
  if (dayjs.isDayjs(input)) {
    return input;
  }
  const parsed = dayjs(input);
  return parsed.isValid() ? parsed : null;
};

const normalizeTime = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : "";
  }
  return String(value);
};

function LocalizedDateText({
  value = null,
  timeValue = null,
  mode = "date",
  dateFormat = "L",
  timeSeparator = " ",
  fallback = "-",
}) {
  const { i18n } = useTranslation();

  const formattedValue = useMemo(() => {
    const locale = i18n.language || "tr";

    if (mode === "time") {
      return normalizeTime(value) || fallback;
    }

    const dateInstance = toDayjsInstance(value);
    const formattedDate = dateInstance ? dateInstance.locale(locale).format(dateFormat) : "";

    if (mode === "datetime") {
      const formattedTime = normalizeTime(timeValue);
      if (formattedDate && formattedTime) {
        return `${formattedDate}${timeSeparator}${formattedTime}`;
      }
      if (formattedDate) {
        return formattedDate;
      }
      return formattedTime || fallback;
    }

    return formattedDate || fallback;
  }, [value, timeValue, mode, dateFormat, timeSeparator, fallback, i18n.language]);

  return <span>{formattedValue}</span>;
}

LocalizedDateText.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date), PropTypes.object]),
  timeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date), PropTypes.object]),
  mode: PropTypes.oneOf(["date", "datetime", "time"]),
  dateFormat: PropTypes.string,
  timeSeparator: PropTypes.string,
  fallback: PropTypes.string,
};

export default LocalizedDateText;
