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

function AyinGunleriSelect(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const ayGroup = watch("ayGroup");

  return (
    <div>
      <Controller
        name="ayinGunleriSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            mode="multiple"
            allowClear
            maxTagCount={3}
            style={{
              width: "250px",
            }}
            placeholder="Ayın Günleri Seçiniz"
            options={options}
            disabled={ayGroup !== 2}
          />
        )}
      />
    </div>
  );
}

export default AyinGunleriSelect;
