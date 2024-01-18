import React from "react";
import { Select, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";

export default function Periyot() {
  const { control, watch, setValue } = useFormContext();

  const periyotValue = watch("periyot");

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setValue("periyot", value); // React Hook Form'da değeri güncelle
  };

  return (
    <Space wrap>
      <Controller
        name="periyot"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            allowClear
            value={periyotValue} // Select bileşeninin değerini kontrol edin
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "1", label: "Yok" },
              { value: "2", label: "Günde" },
              { value: "3", label: "Haftada" },
              { value: "4", label: "Ayda" },
              { value: "5", label: "Yılda" },
            ]}
          />
        )}
      />
    </Space>
  );
}
