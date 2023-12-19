import React from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import Location from "./components/Location";
import MakineTipi from "./components/MakineTipi";
import Kategori from "./components/Kategori";
import MarkaSelect from "./components/MarkaSelect";

const { Text, Link } = Typography;

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid #80808068",
          width: "430px",
          padding: "5px",
          justifyContent: "center",
          gap: "5px",
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Makine Kodu:</Text>
          <Controller
            name="makineKodu"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Makine Tanımı:</Text>
          <Controller
            name="makineTanimi"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <Location />
        <MakineTipi />
        <Kategori />
        <MarkaSelect />
      </div>
    </div>
  );
}
