import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Typography, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // Türkçe yerel ayar
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

dayjs.locale("tr"); // Türkçe yerel ayarı kullan

const { Text } = Typography;

export default function ZamanAraligi() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedTimeRange = watch("timeRange");

  useEffect(() => {
    // İlk render'da varsayılan değeri ayarla
    if (selectedTimeRange === undefined) {
      setValue("timeRange", "all", { shouldValidate: true });
      handleTimeRangeChange("all");
    } else {
      handleTimeRangeChange(selectedTimeRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeRange]);

  const handleTimeRangeChange = (value) => {
    let startDate;
    let endDate;

    switch (value) {
      case "all":
        startDate = null;
        endDate = null;
        break;
      case "today":
        startDate = dayjs().startOf("day");
        endDate = dayjs().endOf("day");
        break;
      case "thisWeek":
        startDate = dayjs().startOf("week");
        endDate = dayjs().endOf("week");
        break;
      case "nextWeek":
        startDate = dayjs().add(1, "week").startOf("week");
        endDate = dayjs().add(1, "week").endOf("week");
        break;
      case "next2Weeks":
        startDate = dayjs().add(2, "weeks").startOf("week");
        endDate = dayjs().add(2, "weeks").endOf("week");
        break;
      case "thisMonth":
        startDate = dayjs().startOf("month");
        endDate = dayjs().endOf("month");
        break;
      case "nextMonth":
        startDate = dayjs().add(1, "month").startOf("month");
        endDate = dayjs().add(1, "month").endOf("month");
        break;
      case "next3Months":
        startDate = dayjs();
        endDate = dayjs().add(3, "months").endOf("day");
        break;
      case "next6Months":
        startDate = dayjs();
        endDate = dayjs().add(6, "months").endOf("day");
        break;
      case "thisYear":
        startDate = dayjs().startOf("year");
        endDate = dayjs().endOf("year");
        break;
      default:
        startDate = null;
        endDate = null;
    }

    setValue("startDate", startDate);
    setValue("endDate", endDate);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ marginRight: "10px" }}>Süre:</Text>
      <Controller
        name="timeRange"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            style={{ width: "300px" }}
            placeholder="Seçim Yap"
            options={[
              { value: "all", label: "Tümü" },
              { value: "today", label: "Bugün" },
              { value: "thisWeek", label: "Bu Hafta" },
              { value: "nextWeek", label: "Gelecek Hafta" },
              { value: "next2Weeks", label: "Gelecek 2 Hafta" },
              { value: "thisMonth", label: "Bu Ay" },
              { value: "nextMonth", label: "Gelecek Ay" },
              { value: "next3Months", label: "Gelecek 3 Ay" },
              { value: "next6Months", label: "Gelecek 6 Ay" },
              { value: "thisYear", label: "Bu Yıl" },
            ]}
          />
        )}
      />
    </div>
  );
}
