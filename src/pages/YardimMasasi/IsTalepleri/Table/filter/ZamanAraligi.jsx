import React, { useEffect } from "react";
import { useForm, Controller, useFormContext } from "react-hook-form";
import { Typography, Select } from "antd";
import dayjs from "dayjs";

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
    // Set default value on initial render if not already set
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
      case "thisMonth":
        startDate = dayjs().startOf("month");
        endDate = dayjs().endOf("month");
        break;
      case "thisYear":
        startDate = dayjs().startOf("year");
        endDate = dayjs().endOf("year");
        break;
      case "lastMonth":
        startDate = dayjs().subtract(1, "month").startOf("month");
        endDate = dayjs().subtract(1, "month").endOf("month");
        break;
      case "last3Months":
        startDate = dayjs().subtract(3, "months").startOf("month");
        endDate = dayjs().endOf("month");
        break;
      case "last6Months":
        startDate = dayjs().subtract(6, "months").startOf("month");
        endDate = dayjs().endOf("month");
        break;
      default:
        startDate = null;
        endDate = null;
    }

    setValue("startDate", startDate);
    setValue("endDate", endDate);
  };

  return (
    <div style={{}}>
      <Controller
        name="timeRange"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            style={{ width: "100px" }}
            placeholder="Seçim Yap"
            options={[
              { value: "all", label: "Tümü" },
              { value: "today", label: "Bugün" },
              { value: "thisWeek", label: "Bu Hafta" },
              { value: "thisMonth", label: "Bu Ay" },
              { value: "thisYear", label: "Bu Yıl" },
              { value: "lastMonth", label: "Son 1 Ay" },
              { value: "last3Months", label: "Son 3 Ay" },
              { value: "last6Months", label: "Son 6 Ay" },
            ]}
          />
        )}
      />
    </div>
  );
}
