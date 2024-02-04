import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import IsEmriTipi from "./components/IsEmriTipi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import EditDrawer from "../../../../../../../DashboardAnalytics2/Update/EditDrawer";
dayjs.extend(customParseFormat);

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function PlanlamaVeIsEmri({ disabled }) {
  const { control, watch, setValue } = useFormContext();
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  // başka bir modülün güncelleme drawerini açmak için kullanılan state
  const [drawerVisible, setDrawerVisible] = useState(false);
  // başka bir modülün güncelleme drawerini açmak için kullanılan state sonu

  const handleEkipmanMinusClick = () => {
    setValue("ekipman", "");
    setValue("ekipmanID", "");
    setValue("ekipmanTanim", "");
  };

  const handleMakineMinusClick = () => {
    setValue("makine", "");
    setValue("makineID", "");
    setValue("makineTanim", "");
    setValue("ekipman", "");
    setValue("ekipmanID", "");
    setValue("ekipmanTanim", "");
  };

  // başka bir modülün güncelleme drawerini açmak için kullanılan state

  const watchedId = watch("isEmriNoID"); // "isEmriNoID" alanını izle

  // Düğmeye basıldığında çalışacak fonksiyon
  const handleOpenDrawer = () => {
    // watchedId değerini kullanarak selectedRow'u güncelle

    // Drawer'ı aç
    setDrawerVisible(true);
  };

  // başka bir modülün güncelleme drawerini açmak için kullanılan state sonu

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric" });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  return (
    <div style={{ paddingBottom: "25px" }}>
      {/* number input okları kaldırma */}
      <style>
        {`
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type='number'] {
        -moz-appearance: textfield;
      }
    `}
      </style>
      <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <div style={{ display: "flex", width: "100%", gap: "10px" }}>
          <div style={{ maxWidth: "475px", width: "100%" }}>
            <div style={{ width: "100%", maxWidth: "475px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>İş Emri Tipi:</Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    maxWidth: "300px",
                    gap: "10px",
                    width: "100%",
                  }}>
                  <IsEmriTipi disabled={disabled} />
                </div>
              </StyledDivBottomLine>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "475px",
                gap: "10px",
                width: "100%",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}>
              <Text style={{ fontSize: "14px" }}>Planlanan Başlama Tarihi:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "300px",
                  minWidth: "300px",
                  gap: "10px",
                  width: "100%",
                }}>
                <Controller
                  name="planlananBaslamaTarihi"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      disabled={disabled}
                      style={{ width: "180px" }}
                      format={localeDateFormat}
                      placeholder="Tarih seçiniz"
                    />
                  )}
                />
                <Controller
                  name="planlananBaslamaSaati"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      disabled={disabled}
                      style={{ width: "110px" }}
                      format={localeTimeFormat}
                      placeholder="Saat seçiniz"
                    />
                  )}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "475px",
                gap: "10px",
                width: "100%",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}>
              <Text style={{ fontSize: "14px" }}>Planlanan Bitiş Tarihi:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "300px",
                  minWidth: "300px",
                  gap: "10px",
                  width: "100%",
                }}>
                <Controller
                  name="planlananBitisTarihi"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      disabled={disabled}
                      style={{ width: "180px" }}
                      format={localeDateFormat}
                      placeholder="Tarih seçiniz"
                    />
                  )}
                />
                <Controller
                  name="planlananBitisSaati"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      disabled={disabled}
                      style={{ width: "110px" }}
                      format={localeTimeFormat}
                      placeholder="Saat seçiniz"
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div style={{ maxWidth: "475px", width: "100%" }}>
            <div style={{ width: "100%", maxWidth: "475px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>İş Emri No:</Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    maxWidth: "300px",
                    gap: "5px",
                    width: "100%",
                  }}>
                  <Controller
                    name="isEmriNo"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ width: "249px" }}
                        disabled
                      />
                    )}
                  />
                  <Controller
                    name="isEmriNoID"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ width: "215px", display: "none" }}
                      />
                    )}
                  />
                  {/* başka bir modülün güncelleme drawerini açmak için */}
                  <div>
                    {/* Drawer'ı açacak düğme */}
                    <Button onClick={handleOpenDrawer}>
                      <EditOutlined />
                    </Button>

                    {/* EditDrawer bileşeni */}
                    <EditDrawer
                      selectedRow={{ key: watchedId }} // watchedId kullanarak selectedRow'u geçir
                      onDrawerClose={() => setDrawerVisible(false)}
                      drawerVisible={drawerVisible}
                      onRefresh={() => console.log("Listeyi yenileme veya gerekli işlemler")}
                    />
                  </div>
                  {/* başka bir modülün güncelleme drawerini açmak için son */}
                </div>
              </StyledDivBottomLine>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "475px",
                gap: "10px",
                width: "100%",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}>
              <Text style={{ fontSize: "14px" }}>Başlama Tarihi:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "300px",
                  minWidth: "300px",
                  gap: "10px",
                  width: "100%",
                }}>
                <Controller
                  name="baslamaTarihi"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      disabled
                      style={{ width: "180px" }}
                      format={localeDateFormat}
                      placeholder="Tarih seçiniz"
                    />
                  )}
                />
                <Controller
                  name="baslamaSaati"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      disabled
                      style={{ width: "110px" }}
                      format={localeTimeFormat}
                      placeholder="Saat seçiniz"
                    />
                  )}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "475px",
                gap: "10px",
                width: "100%",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}>
              <Text style={{ fontSize: "14px" }}>Bitiş Tarihi:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "300px",
                  minWidth: "300px",
                  gap: "10px",
                  width: "100%",
                }}>
                <Controller
                  name="bitisTarihi"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      disabled
                      style={{ width: "180px" }}
                      format={localeDateFormat}
                      placeholder="Tarih seçiniz"
                    />
                  )}
                />
                <Controller
                  name="bitisSaati"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      disabled
                      style={{ width: "110px" }}
                      format={localeTimeFormat}
                      placeholder="Saat seçiniz"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
