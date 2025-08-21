import React, { useEffect } from "react";
import { Input, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";

export default function Ehliyet() {
  const { control, watch, setValue } = useFormContext();

  const ehliyetID = watch("ehliyetID");

  const options = [
    { value: "1", label: "Var" },
    { value: "2", label: "Yok" },
  ];

  // ehliyetID değiştiğinde bu fonksiyon çalışır
  useEffect(() => {
    const ehliyetIDString = String(ehliyetID);
    const selectedOption = options.find((option) => option.value === ehliyetIDString);
    if (selectedOption) {
      setValue("ehliyet", selectedOption.value, { shouldValidate: true });
      setValue("ehliyetLabel", selectedOption.label);
    }
  }, [ehliyetID, setValue]);

  const handleChange = (value) => {
    setValue("ehliyet", value);
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setValue("ehliyetID", selectedOption.value);
      setValue("ehliyetLabel", selectedOption.label);
    } else {
      setValue("ehliyetID", "");
      setValue("ehliyetLabel", "");
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
      <Controller
        name="ehliyet"
        control={control}
        render={({ field }) => (
          <Select {...field} allowClear style={{ width: "100%" }} onChange={handleChange} options={options} />
        )}
      />
      <Controller
        name="ehliyetID"
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
        name="ehliyetLabel"
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
