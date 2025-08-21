import React, { useEffect } from "react";
import { Input, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";

export default function MedeniHali() {
  const { control, watch, setValue } = useFormContext();

  const medeniHalID = watch("medeniHalID");

  const options = [
    { value: "1", label: "EVLİ" },
    { value: "2", label: "BEKAR" },
  ];

  // medeniHalID değiştiğinde bu fonksiyon çalışır
  useEffect(() => {
    const medeniHalIDString = String(medeniHalID);
    const selectedOption = options.find((option) => option.value === medeniHalIDString);
    if (selectedOption) {
      setValue("medeniHal", selectedOption.value, { shouldValidate: true });
      setValue("medeniHalLabel", selectedOption.label);
    }
  }, [medeniHalID, setValue]);

  const handleChange = (value) => {
    setValue("medeniHal", value);
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setValue("medeniHalID", selectedOption.value);
      setValue("medeniHalLabel", selectedOption.label);
    } else {
      setValue("medeniHalID", "");
      setValue("medeniHalLabel", "");
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
      <Controller
        name="medeniHal"
        control={control}
        render={({ field }) => (
          <Select {...field} allowClear style={{ width: "100%" }} onChange={handleChange} options={options} />
        )}
      />
      <Controller
        name="medeniHalID"
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
        name="medeniHalLabel"
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
