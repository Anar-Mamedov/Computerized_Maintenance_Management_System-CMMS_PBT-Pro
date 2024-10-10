import React from "react";
import { Select, Space, Typography } from "antd";

const { Text } = Typography;

import { Controller, useFormContext } from "react-hook-form";

const options = [];
for (let i = 1; i <= 31; i++) {
  let value = i < 10 ? `0${i}` : `${i}`;
  options.push({
    label: value,
    value: value,
  });
}

const options1 = [
  { label: "Ocak", value: "01" },
  { label: "Şubat", value: "02" },
  { label: "Mart", value: "03" },
  { label: "Nisan", value: "04" },
  { label: "Mayıs", value: "05" },
  { label: "Haziran", value: "06" },
  { label: "Temmuz", value: "07" },
  { label: "Ağustos", value: "08" },
  { label: "Eylül", value: "09" },
  { label: "Ekim", value: "10" },
  { label: "Kasım", value: "11" },
  { label: "Aralık", value: "12" },
];

function AyinHaftalari(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const baslangicGroup = watch("baslangicGroup");

  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <Controller
        name="donemBaslangicGunleriSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            allowClear
            style={{
              width: "100px",
            }}
            placeholder="Günler"
            options={options}
            disabled={baslangicGroup !== 3}
          />
        )}
      />
      <Controller
        name="donemBaslangicAylariSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            allowClear
            style={{
              width: "120px",
            }}
            placeholder="Aylar"
            options={options1}
            disabled={baslangicGroup !== 3}
          />
        )}
      />
      <Text>ile</Text>
      <Controller
        name="donemBitisGunleriSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            allowClear
            style={{
              width: "100px",
            }}
            placeholder="Günler"
            options={options}
            disabled={baslangicGroup !== 3}
          />
        )}
      />
      <Controller
        name="donemBitisAylariSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            allowClear
            style={{
              width: "120px",
            }}
            placeholder="Aylar"
            options={options1}
            disabled={baslangicGroup !== 3}
          />
        )}
      />
    </div>
  );
}

export default AyinHaftalari;
