import React from "react";
import { Select, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const options = [
  {
    value: "1",
    label: "Birinci",
  },
  {
    value: "2",
    label: "İkinci",
  },
  {
    value: "3",
    label: "Üçüncü",
  },
  {
    value: "4",
    label: "Dördüncü",
  },
  {
    value: "5",
    label: "Son",
  },
];

const options1 = [
  {
    value: "1",
    label: "Pazartesi",
  },
  {
    value: "2",
    label: "Salı",
  },
  {
    value: "3",
    label: "Çarşamba",
  },
  {
    value: "4",
    label: "Perşembe",
  },
  {
    value: "5",
    label: "Cuma",
  },
  {
    value: "6",
    label: "Cumartesi",
  },
  {
    value: "7",
    label: "Pazar",
  },
];

function AyinHaftalari(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const ayGroup = watch("ayGroup");

  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <Controller
        name="ayinHaftalariSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            allowClear
            style={{
              width: "100px",
            }}
            placeholder="Kaçıncı Hafta"
            options={options}
            disabled={ayGroup !== 3}
          />
        )}
      />
      <Controller
        name="ayinHaftalarininGunuSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            allowClear
            style={{
              width: "120px",
            }}
            placeholder="Haftanın Günü"
            options={options1}
            disabled={ayGroup !== 3}
          />
        )}
      />
    </div>
  );
}

export default AyinHaftalari;
