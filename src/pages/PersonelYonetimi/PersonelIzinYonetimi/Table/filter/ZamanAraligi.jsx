import React, { useEffect } from "react";
import { useForm, Controller, useFormContext } from "react-hook-form";
import { Typography, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // For Turkish locale
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

dayjs.locale("tr"); // use Turkish locale

const { Text } = Typography;

export default function ZamanAraligi({ onSubmit }) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedTimeRange = watch("timeRange");

  useEffect(() => {
  if (!selectedTimeRange) {
    setValue("timeRange", "all", { shouldValidate: true });
    handleTimeRangeChange("all");
  } else {
    handleTimeRangeChange(selectedTimeRange);
  }
}, [selectedTimeRange]);

  const handleTimeRangeChange = (value) => {
  if (value === "all") {
    setValue("BasTarih", null);
    setValue("BitTarih", null);
    onSubmit?.({ BasTarih: null, BitTarih: null })
    return;
  }

  let BasTarih;
  let BitTarih;

  switch (value) {
    case "today":
      BasTarih = dayjs().startOf("day");
      BitTarih = dayjs().endOf("day");
      break;
    case "yesterday":
      BasTarih = dayjs().subtract(1, "day").startOf("day");
      BitTarih = dayjs().subtract(1, "day").endOf("day");
      break;
    case "thisWeek":
      BasTarih = dayjs().startOf("week");
      BitTarih = dayjs().endOf("week");
      break;
    case "lastWeek":
      BasTarih = dayjs().subtract(1, "week").startOf("week");
      BitTarih = dayjs().subtract(1, "week").endOf("week");
      break;
    case "thisMonth":
      BasTarih = dayjs().startOf("month");
      BitTarih = dayjs().endOf("month");
      break;
    case "lastMonth":
      BasTarih = dayjs().subtract(1, "month").startOf("month");
      BitTarih = dayjs().subtract(1, "month").endOf("month");
      break;
    case "thisYear":
      BasTarih = dayjs().startOf("year");
      BitTarih = dayjs().endOf("year");
      break;
    case "lastYear":
      BasTarih = dayjs().subtract(1, "year").startOf("year");
      BitTarih = dayjs().subtract(1, "year").endOf("year");
      break;
    case "last1Month":
      BasTarih = dayjs().subtract(1, "month");
      BitTarih = dayjs();
      break;
    case "last3Months":
      BasTarih = dayjs().subtract(3, "months");
      BitTarih = dayjs();
      break;
    case "last6Months":
      BasTarih = dayjs().subtract(6, "months");
      BitTarih = dayjs();
      break;
    default:
      BasTarih = null;
      BitTarih = null;
  }

  setValue("BasTarih", BasTarih);
  setValue("BitTarih", BitTarih);
};

  return (
    <div style={{}}>
      <Controller
        name="timeRange"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            style={{ width: "130px" }}
            placeholder="Seçim Yap"
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
    </div>
  );
}