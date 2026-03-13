import React, { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // For Turkish locale
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Select } from "antd";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

dayjs.locale("tr"); // use Turkish locale

export default function ZamanAraligi({ onChange }) {
  const { setValue } = useFormContext();
  const [selectedOption, setSelectedOption] = useState("all");
  const isUpdatingRef = useRef(false);
  const initialRenderRef = useRef(true);

  // Component yüklendiğinde varsayılan olarak "Tümü" seçeneğini uygula
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      handleTimeRangeChange("all");
    }
  }, []);

  const handleTimeRangeChange = (timeRange) => {
    // Eğer güncelleme işlemi devam ediyorsa, return
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    setSelectedOption(timeRange);

    let startDate = null;
    let endDate = null;

    // Zaman aralığı değerine göre başlangıç ve bitiş tarihlerini ayarla
    switch (timeRange) {
      case "today":
        startDate = dayjs().startOf("day");
        endDate = dayjs().endOf("day");
        break;
      case "yesterday":
        startDate = dayjs().subtract(1, "day").startOf("day");
        endDate = dayjs().subtract(1, "day").endOf("day");
        break;
      case "thisWeek":
        startDate = dayjs().startOf("week");
        endDate = dayjs().endOf("week");
        break;
      case "lastWeek":
        startDate = dayjs().subtract(1, "week").startOf("week");
        endDate = dayjs().subtract(1, "week").endOf("week");
        break;
      case "thisMonth":
        startDate = dayjs().startOf("month");
        endDate = dayjs().endOf("month");
        break;
      case "lastMonth":
        startDate = dayjs().subtract(1, "month").startOf("month");
        endDate = dayjs().subtract(1, "month").endOf("month");
        break;
      case "thisQuarter":
        startDate = dayjs().startOf("quarter");
        endDate = dayjs().endOf("quarter");
        break;
      case "lastQuarter":
        startDate = dayjs().subtract(1, "quarter").startOf("quarter");
        endDate = dayjs().subtract(1, "quarter").endOf("quarter");
        break;
      case "thisYear":
        startDate = dayjs().startOf("year");
        endDate = dayjs().endOf("year");
        break;
      case "lastYear":
        startDate = dayjs().subtract(1, "year").startOf("year");
        endDate = dayjs().subtract(1, "year").endOf("year");
        break;
      case "all":
      default:
        // Seçim "Tümü" ise veya tanımlanmamışsa null değerleri ayarlanır
        startDate = null;
        endDate = null;
        break;
    }

    // Form state'i güncelle
    setValue("startDate", startDate ? startDate.format("YYYY-MM-DD") : null);
    setValue("endDate", endDate ? endDate.format("YYYY-MM-DD") : null);

    // customfilters objesi oluştur
    const customfilters = {};

    if (timeRange === "all") {
      // "Tümü" seçildiğinde, tarih değerlerini customfilters'dan kaldırmak için
      // özel bir sinyal gönderiyoruz (null değerleri kullanarak)
      onChange({
        customfilters: {
          removeDateFilters: true,
        },
      });
    } else {
      // Sadece null olmayan tarihleri ekle
      if (startDate) {
        customfilters.startDate = startDate.format("YYYY-MM-DD");
      }

      if (endDate) {
        customfilters.endDate = endDate.format("YYYY-MM-DD");
      }

      // Callback'i çağır ve filtreleme için değerleri gönder
      onChange({
        customfilters,
      });
    }

    // Kısa bir süre sonra isUpdatingRef'i false yap
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 10);
  };

  const options = [
    { value: "all", label: "Tümü" },
    { value: "today", label: "Bugün" },
    { value: "yesterday", label: "Dün" },
    { value: "thisWeek", label: "Bu Hafta" },
    { value: "lastWeek", label: "Geçen Hafta" },
    { value: "thisMonth", label: "Bu Ay" },
    { value: "lastMonth", label: "Geçen Ay" },
    { value: "thisQuarter", label: "Bu Çeyrek" },
    { value: "lastQuarter", label: "Geçen Çeyrek" },
    { value: "thisYear", label: "Bu Yıl" },
    { value: "lastYear", label: "Geçen Yıl" },
  ];

  return <Select value={selectedOption} onChange={handleTimeRangeChange} style={{ width: 130 }} options={options} />;
}
