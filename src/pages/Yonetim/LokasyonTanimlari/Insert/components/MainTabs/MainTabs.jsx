import React from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Text, Link } = Typography;

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  const handleMinusClick = () => {
    setValue("masterMakineTanimi", "");
    setValue("masterMakineID", "");
  };

  const handleTakvimMinusClick = () => {
    setValue("makineTakvimTanimi", "");
    setValue("makineTakvimID", "");
  };

  const selectedLokasyonId = watch("selectedLokasyonId");

  return (
    <div style={{ marginBottom: "15px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "650px",
        }}>
        <Text style={{ fontSize: "14px" }}>Lokasyon Tanımı:</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "500px",
            minWidth: "300px",
            gap: "10px",
            width: "-webkit-fill-available",
          }}>
          <Controller
            name="lokasyonTanimi"
            control={control}
            render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
          />
          <Controller
            name="selectedLokasyonId"
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
            name="lokasyonAktif"
            control={control}
            defaultValue={true} // or true if you want it checked by default
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Aktif
              </Checkbox>
            )}
          />
        </div>
      </div>
    </div>
  );
}
