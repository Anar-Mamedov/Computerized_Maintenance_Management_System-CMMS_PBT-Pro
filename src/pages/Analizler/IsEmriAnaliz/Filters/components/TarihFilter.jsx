import React, { useState, useEffect } from "react";
import { Select, Button, Popover, Spin, DatePicker, Typography } from "antd";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

const TarihFilter = () => {
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timeRange, setTimeRange] = useState("all");

  const { setValue } = useFormContext();

  useEffect(() => {
    // Form defaultValues katmanındaki büyük harfli "BaslangicTarihi" ve "BitisTarihi" alanlarına yazıyoruz kanka
    setValue("BaslangicTarihi", startDate ? startDate.format("YYYY-MM-DDTHH:mm:ss") : null);
    setValue("BitisTarihi", endDate ? endDate.format("YYYY-MM-DDTHH:mm:ss") : null);
  }, [startDate, endDate, setValue]);

  const handleSubmit = () => {
    setOpen(false);
  };

  const handleCancelClick = () => {
    setStartDate(null);
    setEndDate(null);
    setTimeRange("all");
    setValue("BaslangicTarihi", null);
    setValue("BitisTarihi", null);
    setOpen(false);
  };

  const handleTimeRangeChange = (value) => {
    let start = null;
    let end = null;

    switch (value) {
      case "all":
        start = dayjs("2026-01-01T00:00:00");
        end = dayjs("2026-05-18T23:59:59");
        break;
      case "today":
        start = dayjs().startOf("day");
        end = dayjs().endOf("day");
        break;
      case "yesterday":
        start = dayjs().subtract(1, "day").startOf("day");
        end = dayjs().subtract(1, "day").endOf("day");
        break;
      case "thisWeek":
        start = dayjs().startOf("week");
        end = dayjs().endOf("week");
        break;
      case "lastWeek":
        start = dayjs().subtract(1, "week").startOf("week");
        end = dayjs().subtract(1, "week").endOf("week");
        break;
      case "thisMonth":
        start = dayjs().startOf("month");
        end = dayjs().endOf("month");
        break;
      case "lastMonth":
        start = dayjs().subtract(1, "month").startOf("month");
        end = dayjs().subtract(1, "month").endOf("month");
        break;
      case "thisYear":
        start = dayjs().startOf("year");
        end = dayjs().endOf("year");
        break;
      case "lastYear":
        start = dayjs().subtract(1, "year").startOf("year");
        end = dayjs().subtract(1, "year").endOf("year");
        break;
      case "last1Month":
        start = dayjs().subtract(1, "month");
        end = dayjs();
        break;
      case "last3Months":
        start = dayjs().subtract(3, "months");
        end = dayjs();
        break;
      case "last6Months":
        start = dayjs().subtract(6, "months");
        end = dayjs();
        break;
      default:
        start = null;
        end = null;
    }

    setStartDate(start);
    setEndDate(end);
    setTimeRange(value);
  };

  const content = (
    <div style={{ width: "300px" }}>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={handleCancelClick}>İptal</Button>
        <Button type="primary" onClick={handleSubmit}>
          Uygula
        </Button>
      </div>

      <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <DatePicker style={{ width: "100%" }} placeholder="Başlangıç Tarihi" value={startDate} onChange={(date) => setStartDate(date)} format="YYYY-MM-DD" />
          <Text style={{ fontSize: "14px" }}>-</Text>
          <DatePicker style={{ width: "100%" }} placeholder="Bitiş Tarihi" value={endDate} onChange={(date) => setEndDate(date)} format="YYYY-MM-DD" />
        </div>
        <Select
          style={{ width: "100%" }}
          value={timeRange}
          onChange={handleTimeRangeChange}
          notFoundContent={
            loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40px" }}>
                <Spin size="small" />
              </div>
            ) : null
          }
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
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottom">
      <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Tarih
          {(startDate || endDate) && (
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#006cb8",
              }}
            />
          )}
        </div>
      </Button>
    </Popover>
  );
};

export default TarihFilter;