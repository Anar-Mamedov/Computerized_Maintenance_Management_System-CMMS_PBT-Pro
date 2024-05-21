import React, { useEffect, useState } from "react";
import { DatePicker, InputNumber, Radio, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import BakimDonemAyVeGun from "./components/BakimDonemAyVeGun.jsx";

const { Text } = Typography;

function ComponentsOfBaslangicBitis(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format

  const baslangicGroup = watch("baslangicGroup");

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(
      formattedSampleDate
        .replace("2021", "YYYY")
        .replace("21", "DD")
        .replace("11", "MM")
    );

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
      hour: "numeric",
      minute: "numeric",
    });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Controller
        name="baslangicGroup"
        control={control}
        render={({ field }) => (
          <Radio.Group
            {...field}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "5px 0 5px 0",
            }}
          >
            <Radio value={1}>Sürekli Bakım</Radio>
            <Radio value={2}>Bakım Tekrarlama Sayısı</Radio>
            <Radio value={3}>Bakım Dönem Aralığı</Radio>
            <Radio value={4}>Bakım Bitiş Tarihi</Radio>
          </Radio.Group>
        )}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          paddingTop: "40px",
        }}
      >
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <Controller
            name="herAy"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "70px" }}
                disabled={baslangicGroup !== 2}
              />
            )}
          />
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <BakimDonemAyVeGun />
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <Controller
            name="bakimBitisTarihi"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                disabled={baslangicGroup !== 4}
                style={{ width: "180px" }}
                format={localeDateFormat}
                placeholder="Tarih seçiniz"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default ComponentsOfBaslangicBitis;
