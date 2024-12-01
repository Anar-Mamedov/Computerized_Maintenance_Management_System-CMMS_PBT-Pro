import React, { useEffect } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, Divider, Image, Switch } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t, use } from "i18next";
import GuncellemeTipi from "./GuncellemeTipi";

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
      {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("stokMiktarlariNegatifeDusebilir")}</Text>
        <Controller name="stokNegatif" control={control} render={({ field }) => <Switch {...field} />} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("malzemeFiyatlariGuncellensin")}</Text>
        <Controller name="malzemeFiyatlariGuncellensin" control={control} render={({ field }) => <Switch {...field} />} />
      </div>

      <div style={{ display: "flex", gap: "15px", width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("guncellemeTipi")}</Text>
          <GuncellemeTipi />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("varsayilanKDVOrani")}</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="KDVOrani" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ flex: 1 }} />} />
          </div>
        </div>
      </div> 
      
      <Divider style={{ marginTop: "10px", marginBottom: "5px" }} />
      */}

      <div style={{ display: "flex", gap: "5px", alignItems: "center", flexDirection: "row", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000ff", fontWeight: "600" }}>{t("formatlar")}</Text>
        <Text style={{ fontSize: "13px", color: "#000000a4" }}>({t("ondalikHassasiyet")})</Text>
      </div>

      <div style={{ display: "flex", gap: "15px", width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("miktar")}</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="miktar" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ flex: 1 }} />} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("ortalama")}</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="ortalama" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ flex: 1 }} />} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("tutar")}</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="tutar" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ flex: 1 }} />} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("sayac")}</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="sayac" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ flex: 1 }} />} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;
