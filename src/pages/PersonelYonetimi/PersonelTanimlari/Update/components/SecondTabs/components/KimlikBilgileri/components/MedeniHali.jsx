import React, { useEffect } from "react";
import { Input, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";

export default function MedeniHali() {
  const { control, watch, setValue } = useFormContext();

  const ucretTipiID = watch("ucretTipiID");

  const options = [
    { value: "1", label: "EVLİ" },
    { value: "2", label: "BEKAR" },
  ];

  // ucretTipiID değiştiğinde bu fonksiyon çalışır
  useEffect(() => {
    const ucretTipiIDString = String(ucretTipiID);
    const selectedOption = options.find((option) => option.value === ucretTipiIDString);
    if (selectedOption) {
      setValue("ucretTipi", selectedOption.value, { shouldValidate: true });
      setValue("ucretTipiLabel", selectedOption.label);
    }
  }, [ucretTipiID, setValue]);

  const handleChange = (value) => {
    setValue("ucretTipi", value);
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setValue("ucretTipiID", selectedOption.value);
      setValue("ucretTipiLabel", selectedOption.label);
    } else {
      setValue("ucretTipiID", "");
      setValue("ucretTipiLabel", "");
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
      <Controller
        name="ucretTipi"
        control={control}
        render={({ field }) => (
          <Select {...field} allowClear style={{ width: "100%" }} onChange={handleChange} options={options} />
        )}
      />
      <Controller
        name="ucretTipiID"
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
        name="ucretTipiLabel"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="text" // Set the type to "text" for name input
            style={{ display: "none" }}
          />
        )}
      />
    </div>
  );
}
