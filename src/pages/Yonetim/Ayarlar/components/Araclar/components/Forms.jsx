import React, { useEffect } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, Divider, Image, Switch } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import KilometreGuncellemesiSelectbox from "./KilometreGuncellemesiSelectbox";

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
      <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("kilometreGuncellemesi")}</Text>
      <KilometreGuncellemesiSelectbox />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("konumTakibiYapilacak")}</Text>
        <Controller name="konumTakibi" control={control} render={({ field }) => <Switch {...field} />} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("aracKartiOzelAlanlaraElleGiriseIzinVer")}</Text>
        <Controller name="aracKartiOzelAlanlar" control={control} render={({ field }) => <Switch {...field} />} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("harcamalariAracMaliyetlerineEkle")}</Text>
        <Controller name="harcalamalarMaliyetler" control={control} render={({ field }) => <Switch {...field} />} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("gelirleriAracGelirlerineEkle")}</Text>
        <Controller name="aracGelirleri" control={control} render={({ field }) => <Switch {...field} />} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("dorseYonetimi")}</Text>
        <Controller name="dorseYonetimi" control={control} render={({ field }) => <Switch {...field} />} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("servisKayitlariMalzemeStokTakibi")}</Text>
        <Controller name="servisKayitlari" control={control} render={({ field }) => <Switch {...field} />} />
      </div>

      <Divider style={{ margin: "0" }} />

      <Text style={{ fontSize: "14px", color: "#000000ff", marginBottom: "10px", fontWeight: "600" }}>{t("seferHareketleri")}</Text>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("kilometreGirisiZorunlu")}</Text>
        <Controller name="kilometreGirisi" control={control} render={({ field }) => <Switch {...field} />} />
      </div>

      <Divider style={{ margin: "0" }} />

      <Text style={{ fontSize: "14px", color: "#000000ff", marginBottom: "10px", fontWeight: "600" }}>{t("lastikBilgileri")}</Text>

      <div style={{ display: "flex", gap: "15px", width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("varsayilanHavaBasinci")}</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="havaBasinci" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ flex: 1 }} />} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("varsayilanDisDerinligi")}</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="disDerinligi" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ flex: 1 }} />} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;
