import React, { useState, useEffect } from "react";
import { Select, Button, Popover, Spin, DatePicker, Typography } from "antd";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

const TarihFilter = () => {
  const [open, setOpen] = useState(false);
  const [loading] = useState(false); // Loading state

  const { setValue, getValues } = useFormContext();

  // Retrieve initial values from the form context
  const initialStartDate = getValues("baslangicTarihi") ? dayjs(getValues("baslangicTarihi")) : null;
  const initialEndDate = getValues("bitisTarihi") ? dayjs(getValues("bitisTarihi")) : null;

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Determine the initial timeRange based on the start and end dates
  const isThisWeek = startDate && endDate && startDate.isSame(dayjs().startOf("week"), "day") && endDate.isSame(dayjs().endOf("week"), "day");

  const [timeRange, setTimeRange] = useState(isThisWeek ? "thisWeek" : "all");

  // Initialize pending states
  const [pendingTimeRange, setPendingTimeRange] = useState(timeRange);
  const [pendingStartDate, setPendingStartDate] = useState(startDate);
  const [pendingEndDate, setPendingEndDate] = useState(endDate);

  const handleSubmit = () => {
    // Apply the pending values to the actual state and form values
    setStartDate(pendingStartDate);
    setEndDate(pendingEndDate);
    setTimeRange(pendingTimeRange);

    // Update form values
    setValue("baslangicTarihi", pendingStartDate);
    setValue("bitisTarihi", pendingEndDate);

    setOpen(false);
  };

  const handleCancelClick = () => {
    // Reset pending values to default and clear date pickers
    setPendingStartDate(null);
    setPendingEndDate(null);
    setPendingTimeRange("all");

    // Reset actual state and form values
    setStartDate(null);
    setEndDate(null);
    setTimeRange("all");

    setValue("baslangicTarihi", null);
    setValue("bitisTarihi", null);

    setOpen(false);
  };

  const handleTimeRangeChange = (value) => {
    let start = null;
    let end = null;

    switch (value) {
      case "all":
        start = null;
        end = null;
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

    setPendingStartDate(start);
    setPendingEndDate(end);
    setPendingTimeRange(value);
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
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Başlangıç Tarihi"
            value={pendingStartDate}
            onChange={(date) => {
              setPendingStartDate(date);
              setPendingTimeRange(null); // Reset timeRange if date is manually changed
            }}
            locale={dayjs.locale("tr")}
          />
          <Text style={{ fontSize: "14px" }}>-</Text>
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Bitiş Tarihi"
            value={pendingEndDate}
            onChange={(date) => {
              setPendingEndDate(date);
              setPendingTimeRange(null); // Reset timeRange if date is manually changed
            }}
            locale={dayjs.locale("tr")}
          />
        </div>
        <Select
          style={{ width: "100%" }}
          value={pendingTimeRange || undefined}
          onChange={handleTimeRangeChange}
          notFoundContent={
            loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40px",
                }}
              >
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
      <Button
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
