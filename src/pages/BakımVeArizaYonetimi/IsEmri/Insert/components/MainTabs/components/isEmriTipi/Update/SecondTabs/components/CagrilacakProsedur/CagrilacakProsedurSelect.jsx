import React, { useEffect } from "react";
import { Input, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";

export default function CagrilacakProsedurSelect() {
  const { control, watch, setValue } = useFormContext();

  const cagrilacakProsedurID = watch("cagrilacakProsedurID");

  const options = [
    { value: "0", label: "Her İkiside" },
    { value: "1", label: "Arıza Prosedürü" },
    { value: "2", label: "Bakım Prosedürü" },
  ];

  // cagrilacakProsedurID değiştiğinde bu fonksiyon çalışır
  useEffect(() => {
    const cagrilacakProsedurIDString = String(cagrilacakProsedurID);
    const selectedOption = options.find((option) => option.value === cagrilacakProsedurIDString);
    if (selectedOption) {
      setValue("cagrilacakProsedur", selectedOption.value, { shouldValidate: true });
      setValue("cagrilacakProsedurLabel", selectedOption.label);
    }
  }, [cagrilacakProsedurID, setValue]);

  const handleChange = (value) => {
    setValue("cagrilacakProsedur", value);
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setValue("cagrilacakProsedurID", selectedOption.value);
      setValue("cagrilacakProsedurLabel", selectedOption.label);
    } else {
      setValue("cagrilacakProsedurID", "");
      setValue("cagrilacakProsedurLabel", "");
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
      <Controller
        name="cagrilacakProsedur"
        control={control}
        render={({ field }) => (
          <Select {...field} allowClear style={{ width: "100%" }} onChange={handleChange} options={options} />
        )}
      />
      <Controller
        name="cagrilacakProsedurID"
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
        name="cagrilacakProsedurLabel"
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
