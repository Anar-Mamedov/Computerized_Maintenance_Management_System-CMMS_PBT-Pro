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

export default function SureBilgileri({ fieldRequirements }) {
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

  const lojistikSuresi = watch("lojistikSuresi");
  const seyahatSuresi = watch("seyahatSuresi");
  const onaySuresi = watch("onaySuresi");
  const beklemeSuresi = watch("beklemeSuresi");
  const digerSuresi = watch("digerSuresi");
  const mudahaleSuresi = watch("mudahaleSuresi");
  const calismaSaat = watch("calismaSaat");
  const calismaDakika = watch("calismaDakika");
  const toplamIsSuresi = watch("toplamIsSuresi");

  useEffect(() => {
    if (lojistikSuresi || seyahatSuresi || onaySuresi || beklemeSuresi || digerSuresi) {
      const mudahaleSuresi1 = lojistikSuresi + seyahatSuresi + onaySuresi + beklemeSuresi + digerSuresi;
      setValue("mudahaleSuresi", mudahaleSuresi1);
    }
    const calismaSuresi = calismaSaat * 60 + calismaDakika;
    if (mudahaleSuresi || calismaSuresi) {
      const toplamIsSuresi1 = mudahaleSuresi + calismaSuresi;
      setValue("toplamIsSuresi", toplamIsSuresi1);
    }
  }, [
    lojistikSuresi,
    seyahatSuresi,
    onaySuresi,
    beklemeSuresi,
    digerSuresi,
    mudahaleSuresi,
    calismaSaat,
    calismaDakika,
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
            maxWidth: "300px",
          }}>
          <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Müdahele Süresi</Text>
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
            <Text style={{ fontSize: "14px" }}>Lojistik Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="lojistikSuresi"
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
            <Text style={{ fontSize: "14px" }}>Seyahet Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="seyahatSuresi"
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
            <Text style={{ fontSize: "14px" }}>Onay Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="onaySuresi"
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
            <Text style={{ fontSize: "14px" }}>Bekleme Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="beklemeSuresi"
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
            <Text style={{ fontSize: "14px" }}>Diğer (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="digerSuresi"
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
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            width: "100%",
            maxWidth: "485px",
          }}>
          <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Toplam İş Süresi</Text>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "330px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Müdahele Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="mudahaleSuresi"
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
              maxWidth: "485px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Çalışma Süresi (Saat - dk):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="calismaSaat"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={24}
                    style={{ width: "145px" }}
                  />
                )}
              />
              <Controller
                name="calismaDakika"
                control={control}
                render={({ field }) => <InputNumber {...field} min={0} max={59} style={{ width: "145px" }} />}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "330px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>Toplam İş Süresi:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="toplamIsSuresi"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                    <InputNumber
                      {...field}
                      status={error ? "error" : ""}
                      min={0}
                      disabled
                      // max={59}
                      style={{ width: "145px" }}
                    />
                    {error && <div style={{ color: "red" }}>{error.message}</div>}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
