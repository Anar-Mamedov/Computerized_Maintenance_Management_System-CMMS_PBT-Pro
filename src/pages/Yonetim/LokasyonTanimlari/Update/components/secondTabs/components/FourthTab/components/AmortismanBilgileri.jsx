import React from "react";
import { Button, Checkbox, DatePicker, Input, Typography } from "antd";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";

const { Text, Link } = Typography;

export default function AmortismanBilgileri() {
  const { control, setValue, watch, handleSubmit, getValues } = useFormContext();
  return (
    <div>
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            border: "1px solid #80808068",
            padding: "10px 10px 10px 10px",
            gap: "25px",
            alignContent: "flex-start",
            height: "fit-content",
          }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", width: "350px", alignContent: "flex-start" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <Text style={{ fontSize: "14px" }}>Hesap Tarihi:</Text>
              <Controller
                name="amortismanHesapTarihi"
                control={control}
                render={({ field }) => (
                  <DatePicker {...field} style={{ width: "250px" }} format="DD-MM-YYYY" placeholder="Tarih seçiniz" />
                )}
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
              <Text style={{ fontSize: "14px" }}>Defter Değeri:</Text>
              <Controller
                name="amortismanDefterDegeri"
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    {...restField}
                    style={{ width: "250px" }}
                    onChange={(e) => {
                      // Allow only numeric input
                      const numericValue = e.target.value.replace(/[^0-9]/g, "");
                      onChange(numericValue);
                    }}
                  />
                )}
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
              <Text style={{ fontSize: "14px" }}>Faydalı Ömrü:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: "250px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Controller
                  name="amortismanFaydaliOmur"
                  control={control}
                  render={({ field: { onChange, ...restField } }) => (
                    <Input
                      {...restField}
                      style={{ width: "215px" }}
                      onChange={(e) => {
                        // Allow only numeric input
                        const numericValue = e.target.value.replace(/[^0-9]/g, "");
                        onChange(numericValue);
                      }}
                    />
                  )}
                />
                <Text>(Ay)</Text>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", width: "250px", alignContent: "flex-start" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <Text style={{ fontSize: "14px" }}>Amortisman Tutarı:</Text>
              <Controller
                name="amortismanTutari"
                control={control}
                render={({ field }) => <Input {...field} disabled style={{ width: "120px" }} />}
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
              <Text style={{ fontSize: "14px" }}>Net Aktif Değeri:</Text>
              <Controller
                name="amortismanNetAktifDegeri"
                control={control}
                render={({ field }) => <Input {...field} disabled style={{ width: "120px" }} />}
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
              <Text style={{ fontSize: "14px" }}>Kalan Süre (Ay):</Text>
              <Controller
                name="amortismanKalanSure"
                control={control}
                render={({ field }) => <Input {...field} disabled style={{ width: "120px" }} />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
