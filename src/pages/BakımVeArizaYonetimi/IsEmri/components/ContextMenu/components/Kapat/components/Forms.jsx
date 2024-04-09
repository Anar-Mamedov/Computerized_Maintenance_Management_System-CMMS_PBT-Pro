import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker, InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import Sekmeler from "./Sekmeler";
import MakineDurumu from "./MakineDurumu";
import customParseFormat from "dayjs/plugin/customParseFormat";
import SonucSelect from "./SonucSelect";
dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Text, Link } = Typography;

const StyledInput = styled(Input)`
  @media (min-width: 600px) {
    max-width: 300px;
  }
  @media (max-width: 600px) {
    max-width: 300px;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 300px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default function Forms({ isModalOpen, selectedRows, iptalDisabled }) {
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  // Sil düğmesini gizlemek için koşullu stil
  const buttonStyle = iptalDisabled ? { display: "none" } : {};

  // sistemin o anki tarih ve saatini almak için

  useEffect(() => {
    if (isModalOpen) {
      const currentDate = dayjs(); // Şu anki tarih için dayjs nesnesi
      const currentTime = dayjs(); // Şu anki saat için dayjs nesnesi

      // Tarih ve saat alanlarını güncelle
      setValue("kapatmaTarihi", currentDate);
      setValue("kapatmaSaati", currentTime);

      // Tablodan seçilen kayıtların IST_KOD değerlerini birleştir
      const istKodlar = selectedRows.map((row) => row.IST_KOD).join(", ");
      setValue("fisNo", istKodlar); // "fisNo" alanını güncelle
    }
  }, [isModalOpen, setValue, selectedRows]);

  // sistemin o anki tarih ve saatini almak sonu

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

  //! Başlama Tarihi ve saati ile Bitiş Tarihi ve saati arasındaki farkı hesaplama

  // Watch for changes in the relevant fields
  const watchFields = watch(["baslamaTarihi", "baslamaSaati", "bitisTarihi", "bitisSaati"]);

  React.useEffect(() => {
    const { baslamaTarihi, baslamaSaati, bitisTarihi, bitisSaati } = getValues();
    if (baslamaTarihi && baslamaSaati && bitisTarihi && bitisSaati) {
      // Başlangıç ve bitiş tarih/saatini birleştir
      const startDateTime = dayjs(baslamaTarihi).hour(baslamaSaati.hour()).minute(baslamaSaati.minute());
      const endDateTime = dayjs(bitisTarihi).hour(bitisSaati.hour()).minute(bitisSaati.minute());

      // İki tarih/saat arasındaki farkı milisaniye cinsinden hesapla
      const diff = endDateTime.diff(startDateTime);

      // Farkı saat ve dakikaya dönüştür
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // Hesaplanan saat ve dakikaları form alanlarına yaz
      setValue("calismaSaat", hours);
      setValue("calismaDakika", minutes);
    }
  }, [watchFields, setValue, getValues]);

  //! Başlama Tarihi ve saati ile Bitiş Tarihi ve saati arasındaki farkı hesaplama sonu

  return (
    <div style={buttonStyle}>
      <div style={{ display: "flex", flexWrap: "wrap", columnGap: "10px" }}>
        <div style={{ width: "100%", maxWidth: "490px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "490px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>Başlama Zamanı:</Text>
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
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    status={errors.baslamaTarihi ? "error" : ""}
                    // disabled={!isDisabled}
                    style={{ width: "180px" }}
                    format={localeDateFormat}
                    placeholder="Tarih seçiniz"
                  />
                )}
              />
              <Controller
                name="baslamaSaati"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <TimePicker
                    {...field}
                    status={errors.baslamaSaati ? "error" : ""}
                    // disabled={!isDisabled}
                    style={{ width: "110px" }}
                    format={localeTimeFormat}
                    placeholder="Saat seçiniz"
                  />
                )}
              />
              {errors.baslamaTarihi && <div style={{ color: "red" }}>{errors.baslamaTarihi.message}</div>}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "490px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>Bitiş Zamanı:</Text>
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
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    status={errors.bitisTarihi ? "error" : ""}
                    // disabled={!isDisabled}
                    style={{ width: "180px" }}
                    format={localeDateFormat}
                    placeholder="Tarih seçiniz"
                  />
                )}
              />
              <Controller
                name="bitisSaati"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <TimePicker
                    {...field}
                    status={errors.bitisSaati ? "error" : ""}
                    // disabled={!isDisabled}
                    style={{ width: "110px" }}
                    format={localeTimeFormat}
                    placeholder="Saat seçiniz"
                  />
                )}
              />
              {errors.bitisTarihi && <div style={{ color: "red" }}>{errors.bitisTarihi.message}</div>}
            </div>
          </div>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "490px",
              marginBottom: "10px",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>Çalışma Süresi (Saat - dk):</Text>
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
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={24}
                    status={errors.calismaSuresi ? "error" : ""}
                    style={{ width: "145px" }}
                  />
                )}
              />
              <Controller
                name="calismaDakika"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    max={59}
                    status={errors.calismaDakika ? "error" : ""}
                    style={{ width: "145px" }}
                  />
                )}
              />
              {errors.calismaDakika && (
                <div style={{ color: "red", marginTop: "5px" }}>{errors.calismaDakika.message}</div>
              )}
            </div>
          </StyledDivBottomLine>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "490px",
              marginBottom: "10px",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>Sonuç:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <SonucSelect />
            </div>
          </StyledDivBottomLine>
        </div>
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "490px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}>
            <Text style={{ fontSize: "14px" }}>Kapatma Tarihi:</Text>
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
                name="kapatmaTarihi"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    style={{ width: "180px" }}
                    format={localeDateFormat}
                    placeholder="Tarih seçiniz"
                  />
                )}
              />
              <Controller
                name="kapatmaSaati"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    style={{ width: "110px" }}
                    format={localeTimeFormat}
                    placeholder="Saat seçiniz"
                  />
                )}
              />
            </div>
          </div>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "490px",
              marginBottom: "10px",
            }}>
            <Text style={{ fontSize: "14px" }}>Bakım Puanı:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="bakimPuani"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={24}
                    style={{ width: "300px" }}
                  />
                )}
              />
            </div>
          </StyledDivBottomLine>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "490px",
              marginBottom: "10px",
            }}>
            <Text style={{ fontSize: "14px" }}>Makine Durumu:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <MakineDurumu />
            </div>
          </StyledDivBottomLine>
        </div>
      </div>

      <Sekmeler />
    </div>
  );
}
