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
    setValue("baslangicTarihi", null);
    setValue("bitisTarihi", null);
    onSubmit?.({ baslangicTarihi: null, bitisTarihi: null })
    return;
  }

  let baslangicTarihi;
  let bitisTarihi;

  switch (value) {
    case "today":
      baslangicTarihi = dayjs().startOf("day");
      bitisTarihi = dayjs().endOf("day");
      break;
    case "yesterday":
      baslangicTarihi = dayjs().subtract(1, "day").startOf("day");
      bitisTarihi = dayjs().subtract(1, "day").endOf("day");
      break;
    case "thisWeek":
      baslangicTarihi = dayjs().startOf("week");
      bitisTarihi = dayjs().endOf("week");
      break;
    case "lastWeek":
      baslangicTarihi = dayjs().subtract(1, "week").startOf("week");
      bitisTarihi = dayjs().subtract(1, "week").endOf("week");
      break;
    case "thisMonth":
      baslangicTarihi = dayjs().startOf("month");
      bitisTarihi = dayjs().endOf("month");
      break;
    case "lastMonth":
      baslangicTarihi = dayjs().subtract(1, "month").startOf("month");
      bitisTarihi = dayjs().subtract(1, "month").endOf("month");
      break;
    case "thisYear":
      baslangicTarihi = dayjs().startOf("year");
      bitisTarihi = dayjs().endOf("year");
      break;
    case "lastYear":
      baslangicTarihi = dayjs().subtract(1, "year").startOf("year");
      bitisTarihi = dayjs().subtract(1, "year").endOf("year");
      break;
    case "last1Month":
      baslangicTarihi = dayjs().subtract(1, "month");
      bitisTarihi = dayjs();
      break;
    case "last3Months":
      baslangicTarihi = dayjs().subtract(3, "months");
      bitisTarihi = dayjs();
      break;
    case "last6Months":
      baslangicTarihi = dayjs().subtract(6, "months");
      bitisTarihi = dayjs();
      break;
    default:
      baslangicTarihi = null;
      bitisTarihi = null;
  }

  setValue("baslangicTarihi", baslangicTarihi);
  setValue("bitisTarihi", bitisTarihi);
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