import React from "react";
import { Input, Typography } from "antd";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";

const { TextArea } = Input;
const { Text, Link } = Typography;

export default function Notes() {
  const { control, setValue, watch, handleSubmit, getValues } = useFormContext();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexWrap: "wrap", width: "49%", justifyContent: "center", gap: "10px" }}>
        <Text style={{ fontSize: "14px" }}>Genel Not</Text>
        <Controller
          name="makineGenelNot"
          control={control}
          render={({ field }) => <TextArea {...field} rows={4} placeholder="Notlarınızı giriniz" />}
        />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", width: "49%", justifyContent: "center", gap: "10px" }}>
        <Text style={{ fontSize: "14px" }}>Güvenlik Notu</Text>
        <Controller
          name="makineGuvenlikNotu"
          control={control}
          render={({ field }) => <TextArea {...field} rows={4} placeholder="Notlarınızı giriniz" />}
        />
      </div>
    </div>
  );
}
