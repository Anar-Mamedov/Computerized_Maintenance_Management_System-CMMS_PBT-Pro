import React, { useEffect } from "react";
import { Input, Select, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";

export default function Periyot() {
  const { control, watch, setValue } = useFormContext();

  const periyotID = watch("periyotID");

  const options = [
    { value: "1", label: "Yok" },
    { value: "2", label: "Günde" },
    { value: "3", label: "Haftada" },
    { value: "4", label: "Ayda" },
    { value: "5", label: "Yılda" },
  ];

  // periyotID değiştiğinde bu fonksiyon çalışır
  useEffect(() => {
    const periyotIDString = String(periyotID);
    const selectedOption = options.find((option) => option.value === periyotIDString);
    if (selectedOption) {
      setValue("periyot", selectedOption.value, { shouldValidate: true });
      setValue("periyotLabel", selectedOption.label);
    }
  }, [periyotID, setValue]);

  const handleChange = (value) => {
    setValue("periyot", value);
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setValue("periyotID", selectedOption.value);
      setValue("periyotLabel", selectedOption.label);
    } else {
      setValue("periyotID", "");
      setValue("periyotLabel", "");
    }
  };

  return (
    <Space wrap>
      <Controller
        name="periyot"
        control={control}
        render={({ field }) => (
          <Select {...field} allowClear style={{ width: 120 }} onChange={handleChange} options={options} />
        )}
      />
      <Controller
        name="periyotID"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="text" // Set the type to "text" for name input
            style={{ display: "none" }}
          />
        )}
      />
      <Controller
        name="periyotLabel"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="text" // Set the type to "text" for name input
            style={{ display: "none" }}
          />
        )}
      />
    </Space>
  );
}
