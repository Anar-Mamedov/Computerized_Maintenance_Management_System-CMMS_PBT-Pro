import React from "react";
import { Button, Checkbox, DatePicker, Input, Typography } from "antd";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import Firma from "./Firma";

const { Text, Link } = Typography;

export default function SatinalmaKrediBilgileri() {
  const { control, setValue, watch, handleSubmit, getValues } = useFormContext();

  const handleFirmaMinusClick = () => {
    setValue("makineSatinalmaFirma", "");
    setValue("makineSatinalmaFirmaID", "");
  };

  return (
    <div>
      <div>
        <div
          style={{
            width: "fit-content",
            position: "relative",
            marginBottom: "-11px",
            marginLeft: "10px",
            backgroundColor: "white",
            zIndex: "1",
          }}>
          <Text style={{ fontSize: "14px" }}>Satınalma Bilgileri</Text>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            border: "1px solid #80808068",
            padding: "15px 5px 5px 5px",
            gap: "15px",
            alignContent: "flex-start",
            height: "fit-content",
          }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", width: "370px" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <Text style={{ fontSize: "14px" }}>Firma:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "300px",
                }}>
                <Controller
                  name="makineSatinalmaFirma"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      style={{ width: "215px" }}
                      disabled
                    />
                  )}
                />
                <Controller
                  name="makineSatinalmaFirmaID"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      style={{ display: "none" }}
                    />
                  )}
                />
                <Firma
                  onSubmit={(selectedData) => {
                    setValue("makineSatinalmaFirma", selectedData.subject);
                    setValue("makineSatinalmaFirmaID", selectedData.key);
                  }}
                />
                <Button onClick={handleFirmaMinusClick}> - </Button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <Text style={{ fontSize: "14px" }}>Tarihi:</Text>
              <Controller
                name="makineSatinalmaTarihi"
                control={control}
                render={({ field }) => (
                  <DatePicker {...field} style={{ width: "300px" }} format="DD-MM-YYYY" placeholder="Tarih seçiniz" />
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
              <Text style={{ fontSize: "14px" }}>Fiyatı:</Text>
              <Controller
                name="satinalmaFiyati"
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    {...restField}
                    style={{ width: "300px" }}
                    onChange={(e) => {
                      // Allow only numeric input
                      const numericValue = e.target.value.replace(/[^0-9]/g, "");
                      onChange(numericValue);
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", width: "230px", alignContent: "flex-start" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <Text style={{ fontSize: "14px" }}>Fatura No:</Text>
              <Controller
                name="satinalmaFaturaNo"
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <Input
                    {...restField}
                    style={{ width: "150px" }}
                    onChange={(e) => {
                      // Allow only numeric input
                      const numericValue = e.target.value.replace(/[^0-9]/g, "");
                      onChange(numericValue);
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            width: "fit-content",
            position: "relative",
            marginBottom: "-11px",
            marginLeft: "10px",
            backgroundColor: "white",
            zIndex: "1",
          }}>
          <Text style={{ fontSize: "14px" }}>Kredi Bilgileri</Text>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            border: "1px solid #80808068",
            width: "430px",
            padding: "15px 5px 5px 5px",
            gap: "5px",
            alignContent: "flex-start",
            height: "fit-content",
          }}>
          yusuf
        </div>
      </div>
    </div>
  );
}
