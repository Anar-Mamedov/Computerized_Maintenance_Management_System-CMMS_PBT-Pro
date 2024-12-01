import React, { useEffect } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, Divider, Image, Switch } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import IzinTuruSelectbox from "./IzinTuruSelectbox";

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
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
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
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("varsayilanOTVOrani")}</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="OTVOrani" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ flex: 1 }} />} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("stokMiktarininNegatifeDusmesi")}</Text>
          <IzinTuruSelectbox name={"stokMiktarininNegatifeDusmesi"} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("sayimFazlasiVeEksigiIcinOtomatikStokFisiOlusturulmasi")}</Text>
          <IzinTuruSelectbox name={"sayimFazlasi"} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", marginTop: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("malzemeDepoTransferOnayi")}</Text>
        <Controller name="transferOnayi" control={control} render={({ field }) => <Switch {...field} />} />
      </div>
    </div>
  );
}

export default Forms;
