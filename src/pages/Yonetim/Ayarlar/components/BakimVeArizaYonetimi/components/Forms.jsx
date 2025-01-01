import React, { useEffect } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, Divider, Image, Switch } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Text, Link } = Typography;
const { TextArea } = Input;

function Forms() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", marginTop: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("periyodikBakimIsEmirleriOtomatikOlusturulsun")}</Text>
        <Controller name="isEmriniOtomatikOlustur" control={control} render={({ field }) => <Switch {...field} />} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("periyodikBakimIsEmirleriKacGunOncedenOlusturulsun")}</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="isEmriKacGunOncedenOlusturulacak" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ flex: 1 }} />} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;
