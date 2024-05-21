import React from "react";
import { Select, Space } from "antd";
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
  {
    value: "01",
    label: "Ocak",
  },
  {
    value: "02",
    label: "Şubat",
  },
  {
    value: "03",
    label: "Mart",
  },
  {
    value: "04",
    label: "Nisan",
  },
  {
    value: "05",
    label: "Mayıs",
  },
  {
    value: "06",
    label: "Haziran",
  },
  {
    value: "07",
    label: "Temmuz",
  },
  {
    value: "08",
    label: "Ağustos",
  },
  {
    value: "09",
    label: "Eylül",
  },
  {
    value: "10",
    label: "Ekim",
  },
  {
    value: "11",
    label: "Kasım",
  },
  {
    value: "12",
    label: "Aralık",
  },
];

function AyinHaftalari(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const yilGroup = watch("yilGroup");

  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <Controller
        name="ayinGunleriSelect"
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
            disabled={yilGroup !== 2}
          />
        )}
      />
      <Controller
        name="yilinAylariSelect"
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
            disabled={yilGroup !== 2}
          />
        )}
      />
    </div>
  );
}

export default AyinHaftalari;
