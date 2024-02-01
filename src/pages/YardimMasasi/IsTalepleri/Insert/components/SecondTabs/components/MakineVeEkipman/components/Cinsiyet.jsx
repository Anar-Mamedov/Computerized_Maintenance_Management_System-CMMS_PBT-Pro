import React, { useEffect } from "react";
import { Input, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";

export default function Cinsiyet() {
  const { control, watch, setValue } = useFormContext();

  const cinsiyetID = watch("cinsiyetID");

  const options = [
    { value: "1", label: "Erkek" },
    { value: "2", label: "Kadın" },
  ];

  // cinsiyetID değiştiğinde bu fonksiyon çalışır
  useEffect(() => {
    const cinsiyetIDString = String(cinsiyetID);
    const selectedOption = options.find((option) => option.value === cinsiyetIDString);
    if (selectedOption) {
      setValue("cinsiyet", selectedOption.value, { shouldValidate: true });
      setValue("cinsiyetLabel", selectedOption.label);
    }
  }, [cinsiyetID, setValue]);

  const handleChange = (value) => {
    setValue("cinsiyet", value);
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setValue("cinsiyetID", selectedOption.value);
      setValue("cinsiyetLabel", selectedOption.label);
    } else {
      setValue("cinsiyetID", "");
      setValue("cinsiyetLabel", "");
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
      <Controller
        name="cinsiyet"
        control={control}
        render={({ field }) => (
          <Select {...field} allowClear style={{ width: "100%" }} onChange={handleChange} options={options} />
        )}
      />
      <Controller
        name="cinsiyetID"
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
        name="cinsiyetLabel"
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
