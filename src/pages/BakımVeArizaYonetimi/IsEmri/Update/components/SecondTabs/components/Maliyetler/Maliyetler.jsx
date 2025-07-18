import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker, Slider, InputNumber, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import { useAppContext } from "../../../../../../../../AppContext"; // Context hook'unu import edin

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

// iş emri selectboxu sayfa ilk defa render olduğunda prosedür ve sonraki 3 fieldin değerlerini sıfırlamasın diye ilk renderdeki durumu tutması için

// Önceki değeri tutmak için bir hook
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]); // value değiştiğinde çalış
  return ref.current;
}

// iş emri selectboxu sayfa ilk defa render olduğunda prosedür ve sonraki 3 fieldin değerlerini sıfırlamasın diye ilk renderdeki durumu tutması için son

export default function Maliyetler({ fieldRequirements }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { selectedOption } = useAppContext(); // Context'ten seçilen opsiyonu al iş emri tipi selectboxu değiştiğinde prosedürü sıfırlaması için
  const previousSelectedOption = usePrevious(selectedOption); // Önceki seçilen opsiyonu al iş emri tipi selectboxu değiştiğinde prosedürü sıfırlaması için
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format

  // date picker için tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

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

  const malzemeMaliyetiGercek = watch("malzemeMaliyetiGercek");
  const iscilikMaliyetiGercek = watch("iscilikMaliyetiGercek");
  const maliyet = watch("maliyet");
  const genelGiderlerGercek = watch("genelGiderlerGercek");
  const indirimGercek = watch("indirimGercek");
  const kdvGercek = watch("kdvGercek");
  const toplamIsSuresi = watch("toplamIsSuresi");

  useEffect(() => {
    if (
      malzemeMaliyetiGercek ||
      iscilikMaliyetiGercek ||
      maliyet ||
      genelGiderlerGercek ||
      indirimGercek ||
      kdvGercek
    ) {
      const toplamMaliyetGercek1 =
        malzemeMaliyetiGercek + iscilikMaliyetiGercek + maliyet + genelGiderlerGercek + kdvGercek;
      setValue("toplamMaliyetGercek", toplamMaliyetGercek1 - indirimGercek);
    }
  }, [
    malzemeMaliyetiGercek,
    iscilikMaliyetiGercek,
    maliyet,
    genelGiderlerGercek,
    indirimGercek,
    kdvGercek,
    toplamIsSuresi,
    setValue,
  ]);

  return (
    <div style={{ paddingBottom: "35px" }}>
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            width: "100%",
            maxWidth: "450px",
          }}>
          <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Maliyetler</Text>
          </div>
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <div style={{ width: "300px", display: "flex", justifyContent: "space-between", float: "inline-end" }}>
              <Text style={{ fontSize: "14px" }}>Gerçekleşen</Text>
              <Text style={{ fontSize: "14px", width: "145px" }}>Öngörülen</Text>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Malzeme Maliyeti:</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="malzemeMaliyetiGercek"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
              <Controller
                name="malzemeMaliyetiOngorulen"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
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
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>İşçilik Maliyeti:</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="iscilikMaliyetiGercek"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
              <Controller
                name="iscilikMaliyetiOngorulen"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
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
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Dış Servis Maliyeti:</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="maliyet"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
              <Controller
                name="disServisMaliyetiOngorulen"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
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
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Genel Giderler:</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="genelGiderlerGercek"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
              <Controller
                name="genelGiderlerOngorulen"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
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
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>İndirim:</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="indirimGercek"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
              <Controller
                name="indirimOngorulen"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
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
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>KDV Tutarı:</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="kdvGercek"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
              <Controller
                name="kdvOngorulen"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
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
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.toplamMaliyetGercek ? "600" : "normal" }}>
              Toplam Maliyet:
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="toplamMaliyetGercek"
                control={control}
                rules={{ required: fieldRequirements.toplamMaliyetGercek ? "Alan Boş Bırakılamaz!" : false }}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    status={errors.toplamMaliyetGercek ? "error" : ""}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
              <Controller
                name="toplamMaliyetOngorulen"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
              {errors.toplamMaliyetGercek && (
                <div style={{ color: "red", marginTop: "5px" }}>{errors.toplamMaliyetGercek.message}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
