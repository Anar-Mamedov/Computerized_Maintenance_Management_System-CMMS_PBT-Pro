import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/tr";

dayjs.locale("tr");

export default function ZamanAraligi({ onChange }) {
  const { control, watch, setValue } = useFormContext();
  const selectedTimeRange = watch("timeRange");

  const handleTimeRangeChange = (value) => {
    let bas = null;
    let bit = null;

    if (value !== "all") {
      switch (value) {
        case "today":
          bas = dayjs().startOf("day");
          bit = dayjs().endOf("day");
          break;
        case "yesterday":
          bas = dayjs().subtract(1, "day").startOf("day");
          bit = dayjs().subtract(1, "day").endOf("day");
          break;
        case "thisWeek":
          bas = dayjs().startOf("week");
          bit = dayjs().endOf("week");
          break;
        case "lastWeek":
          bas = dayjs().subtract(1, "week").startOf("week");
          bit = dayjs().subtract(1, "week").endOf("week");
          break;
        case "thisMonth":
          bas = dayjs().startOf("month");
          bit = dayjs().endOf("month");
          break;
        case "lastMonth":
          bas = dayjs().subtract(1, "month").startOf("month");
          bit = dayjs().subtract(1, "month").endOf("month");
          break;
        case "thisYear":
          bas = dayjs().startOf("year");
          bit = dayjs().endOf("year");
          break;
        case "lastYear":
          bas = dayjs().subtract(1, "year").startOf("year");
          bit = dayjs().subtract(1, "year").endOf("year");
          break;
        case "last1Month":
          bas = dayjs().subtract(1, "month").startOf("day");
          bit = dayjs().endOf("day");
          break;
        case "last3Months":
          bas = dayjs().subtract(3, "months").startOf("day");
          bit = dayjs().endOf("day");
          break;
        case "last6Months":
          bas = dayjs().subtract(6, "months").startOf("day");
          bit = dayjs().endOf("day");
          break;
        default:
          bas = null;
          bit = null;
      }
    }

    // Backend'in beklediği ISO formatı: YYYY-MM-DDTHH:mm:ss
    const startStr = bas ? bas.format("YYYY-MM-DDTHH:mm:ss") : null;
    const endStr = bit ? bit.format("YYYY-MM-DDTHH:mm:ss") : null;

    setValue("BaslangicTarihi", startStr);
    setValue("BitisTarihi", endStr);
    
    // Filtre değiştiğinde ana tabloyu tetikle
    onChange?.("BaslangicTarihi", startStr);
    onChange?.("BitisTarihi", endStr);
  };

  useEffect(() => {
    if (selectedTimeRange) {
      handleTimeRangeChange(selectedTimeRange);
    }
  }, [selectedTimeRange]);

  return (
    <Controller
      name="timeRange"
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          style={{ width: "140px" }}
          placeholder="Tarih Seç"
          options={[
            { value: "all", label: "Tümü" },
            { value: "today", label: "Bugün" },
            { value: "yesterday", label: "Dün" },
            { value: "thisWeek", label: "Bu Hafta" },
            { value: "lastWeek", label: "Geçen Hafta" },
            { value: "thisMonth", label: "Bu Ay" },
            { value: "lastMonth", label: "Geçen Ay" },
            { value: "thisYear", label: "Bu Yıl" },
            { value: "lastYear", label: "Geçen Yıl" },
            { value: "last1Month", label: "Son 1 Ay" },
            { value: "last3Months", label: "Son 3 Ay" },
            { value: "last6Months", label: "Son 6 Ay" },
          ]}
        />
      )}
    />
  );
}