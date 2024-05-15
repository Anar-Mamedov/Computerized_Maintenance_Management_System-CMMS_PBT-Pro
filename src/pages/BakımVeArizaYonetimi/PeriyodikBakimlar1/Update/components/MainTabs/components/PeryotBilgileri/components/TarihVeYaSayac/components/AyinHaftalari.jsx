import React from "react";
import { Select, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const options = [
  {
    value: "Birinci",
    label: "Birinci",
  },
  {
    value: "İkinci",
    label: "İkinci",
  },
  {
    value: "Üçüncü",
    label: "Üçüncü",
  },
  {
    value: "Dördüncü",
    label: "Dördüncü",
  },
  {
    value: "Son",
    label: "Son",
  },
];

const options1 = [
  {
    value: "Pazartesi",
    label: "Pazartesi",
  },
  {
    value: "Salı",
    label: "Salı",
  },
  {
    value: "Çarşamba",
    label: "Çarşamba",
  },
  {
    value: "Perşembe",
    label: "Perşembe",
  },
  {
    value: "Cuma",
    label: "Cuma",
  },
  {
    value: "Cumartesi",
    label: "Cumartesi",
  },
  {
    value: "Pazar",
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

  console.log(watch("ayinHaftalariSelect"));
  console.log(watch("ayinHaftalarininGunuSelect"));

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
