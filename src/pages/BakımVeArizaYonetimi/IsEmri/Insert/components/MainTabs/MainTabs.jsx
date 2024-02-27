import React, { useEffect, useState } from "react";
import {
  Drawer,
  Typography,
  Button,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Checkbox,
  ColorPicker,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import LokasyonTablo from "./components/LokasyonTablo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Departman from "./components/Departman";
import IsEmriDurumModal from "./components/IsEmriDurumModal";
import IletisimSekli from "./components/IletisimSekli";
import IsEmriTipiSelect from "./components/IsEmriTipiSelect";
import IsKategorisi from "./components/IsKategorisi";
import ServisNedeni from "./components/ServisNedeni";
import BildirilenBina from "./components/BildirilenBina";
import BildirilenKat from "./components/BildirilenKat";
import OncelikTablo from "./components/OncelikTablo";
import BagliIsEmriTablo from "./components/BagliIsEmriTablo";
import MakineDurumu from "./components/MakineDurumu";
import MakineTablo from "./components/MakineTablo";
import EkipmanTablo from "./components/EkipmanTablo";

const { Text, Link } = Typography;
const { TextArea } = Input;

dayjs.extend(customParseFormat);

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

export default function MainTabs({ drawerOpen, isDisabled, fieldRequirements }) {
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // garanti bitiş tarihi alanını izleme ve ona göre yazı yazdırma
  const garantiBitis = watch("garantiBitis"); // garantiBitis alanını izle
  const [garantiDurumu, setGarantiDurumu] = useState(""); // Garanti durum metnini tutacak state

  useEffect(() => {
    // garantiBitis değeri kontrol ediliyor
    if (garantiBitis) {
      const today = new Date();
      const bitisTarihi = new Date(garantiBitis);
      if (bitisTarihi < today) {
        // Garanti süresi dolduysa
        setGarantiDurumu("Garanti süresi doldu.");
      } else {
        // Garanti süresi devam ediyorsa
        setGarantiDurumu("Garanti süresi devam etmektedir.");
      }
    } else {
      // garantiBitis değeri boşsa, garanti durumu metnini temizle
      setGarantiDurumu("");
    }
  }, [garantiBitis]); // garantiBitis değiştiğinde useEffect tetiklenecek

  // garanti bitiş tarihi alanını izleme ve ona göre yazı yazdırma sonu

  const otonomBakimValue = watch("otonomBakim");

  const handleIsEmriDurumMinusClick = () => {
    setValue("isEmriDurum", "");
    setValue("isEmriDurumID", "");
  };

  const handleIlgiliKisiMinusClick = () => {
    setValue("ilgiliKisi", "");
    setValue("ilgiliKisiID", "");
  };

  const handleOncelikMinusClick = () => {
    setValue("oncelikTanim", "");
    setValue("oncelikID", "");
  };

  const handleBagliIsEmriMinusClick = () => {
    setValue("bagliIsEmriTanim", "");
    setValue("bagliIsEmriID", "");
  };

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
    setValue("tamLokasyonTanim", "");
    setValue("makine", "");
    setValue("makineID", "");
    setValue("makineTanim", "");
    setValue("ekipman", "");
    setValue("ekipmanID", "");
    setValue("ekipmanTanim", "");
    setValue("makineDurumu", null);
    setValue("makineDurumuID", "");
    setValue("garantiBitis", "");
  };

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
    setValue("makineDurumu", null);
    setValue("makineDurumuID", "");
    setValue("garantiBitis", "");
  };

  // sistemin o anki tarih ve saatini almak için

  useEffect(() => {
    if (drawerOpen) {
      const currentDate = dayjs(); // Şu anki tarih için dayjs nesnesi
      const currentTime = dayjs(); // Şu anki saat için dayjs nesnesi

      // Tarih ve saat alanlarını güncelle
      setValue("duzenlenmeTarihi", currentDate);
      setValue("duzenlenmeSaati", currentTime);
    }
  }, [drawerOpen, setValue]);

  // sistemin o anki tarih ve saatini almak sonu

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time || time.trim() === "") return ""; // `trim` metodu ile baştaki ve sondaki boşlukları temizle

    try {
      // Saati ve dakikayı parçalara ayır, boşlukları temizle
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      // Saat ve dakika değerlerinin geçerliliğini kontrol et
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        throw new Error("Invalid time format");
      }

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

      // Kullanıcının lokal ayarlarına uygun olarak saat ve dakikayı formatla
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının yerel ayarlarına göre otomatik seçim yapmasına izin ver
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        // hour12 seçeneği burada belirtilmiyor; böylece otomatik olarak kullanıcının sistem ayarlarına göre belirleniyor
      });

      // Formatlanmış saati döndür
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ""; // Hata durumunda boş bir string döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

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
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "15px",
        gap: "20px",
        rowGap: "10px",
      }}>
      <div style={{ display: "flex", gap: "20px", width: "100%", flexWrap: "wrap" }}>
        <div
          style={{
            display: "flex",
            marginBottom: "15px",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "450px",
          }}>
          <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Genel Bilgiler</Text>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "450px",
              gap: "10px",
              rowGap: "0px",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>İş Emri No:</Text>
            <div
              style={{
                display: "flex",
                // flexWrap: "wrap",
                alignItems: "flex-start",
                maxWidth: "300px",
                minWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="talepKodu"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                    <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                    {error && <div style={{ color: "red" }}>{error.message}</div>}
                  </div>
                )}
              />
              <Controller
                name="secilenTalepID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
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
              maxWidth: "450px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>Düzenlenme Tarihi:</Text>
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
                name="duzenlenmeTarihi"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    status={error ? "error" : ""}
                    // disabled={!isDisabled}
                    style={{ width: "180px" }}
                    format={localeDateFormat}
                    placeholder="Tarih seçiniz"
                  />
                )}
              />
              <Controller
                name="duzenlenmeSaati"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <TimePicker
                    {...field}
                    status={errors.duzenlenmeSaati ? "error" : ""}
                    // disabled={!isDisabled}
                    style={{ width: "110px" }}
                    format={localeTimeFormat}
                    placeholder="Saat seçiniz"
                  />
                )}
              />
              {errors.duzenlenmeSaati && <div style={{ color: "red" }}>{errors.duzenlenmeSaati.message}</div>}
            </div>
          </div>
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <Text style={{ fontSize: "14px", fontWeight: "600" }}>İş Emri Tipi:</Text>
              <IsEmriTipiSelect fieldRequirements={fieldRequirements} />
            </StyledDivBottomLine>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "450px",
              }}>
              <Text style={{ fontSize: "14px", fontWeight: "600" }}>Durum:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "300px",
                }}>
                <Controller
                  name="isEmriDurum"
                  control={control}
                  rules={{ required: "Alan Boş Bırakılamaz!" }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      status={errors.isEmriDurum ? "error" : ""}
                      type="text" // Set the type to "text" for name input
                      style={{ width: "255px" }}
                      disabled
                    />
                  )}
                />
                <Controller
                  name="isEmriDurumID"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      style={{ display: "none" }}
                    />
                  )}
                />
                <IsEmriDurumModal
                  fieldRequirements={fieldRequirements}
                  onSubmit={(selectedData) => {
                    setValue("isEmriDurum", selectedData.ISK_ISIM);
                    setValue("isEmriDurumID", selectedData.key);
                  }}
                />
                {errors.isEmriDurum && (
                  <div style={{ color: "red", marginTop: "10px" }}>{errors.isEmriDurum.message}</div>
                )}
              </div>
            </StyledDivBottomLine>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "450px",
              }}>
              <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.bagliIsEmriTanim ? "600" : "normal" }}>
                Bağlı İş Emri:
              </Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "300px",
                }}>
                <Controller
                  name="bagliIsEmriTanim"
                  control={control}
                  rules={{ required: fieldRequirements.bagliIsEmriTanim ? "Alan Boş Bırakılamaz!" : false }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      status={errors.bagliIsEmriTanim ? "error" : ""}
                      type="text" // Set the type to "text" for name input
                      style={{ width: "215px" }}
                      disabled
                    />
                  )}
                />
                <Controller
                  name="bagliIsEmriID"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      style={{ display: "none" }}
                    />
                  )}
                />
                <BagliIsEmriTablo
                  onSubmit={(selectedData) => {
                    setValue("bagliIsEmriTanim", selectedData.ISEMRI_NO);
                    setValue("bagliIsEmriID", selectedData.key);
                  }}
                />
                <Button onClick={handleBagliIsEmriMinusClick}> - </Button>
                {errors.bagliIsEmriTanim && (
                  <div style={{ color: "red", marginTop: "5px" }}>{errors.bagliIsEmriTanim.message}</div>
                )}
              </div>
            </StyledDivBottomLine>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginBottom: "15px",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "755px",
          }}>
          <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Makine / Lokasyon Bilgileri</Text>
          </div>
          <StyledDivMedia
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "755px",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.lokasyonTanim ? "600" : "normal" }}>
              Lokasyon:
            </Text>
            <div>
              <div style={{ display: "flex", gap: "5px" }}>
                <div
                  className="anar"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minWidth: "300px",
                    gap: "3px",
                  }}>
                  <Controller
                    name="lokasyonTanim"
                    control={control}
                    rules={{ required: fieldRequirements.lokasyonTanim ? "Alan Boş Bırakılamaz!" : false }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        status={errors.lokasyonTanim ? "error" : ""}
                        type="text" // Set the type to "text" for name input
                        style={{ width: "100%", maxWidth: "630px" }}
                        disabled
                      />
                    )}
                  />
                  <Controller
                    name="lokasyonID"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ display: "none" }}
                      />
                    )}
                  />
                  <LokasyonTablo
                    onSubmit={(selectedData) => {
                      setValue("lokasyonTanim", selectedData.LOK_TANIM);
                      setValue("lokasyonID", selectedData.key);
                      setValue("tamLokasyonTanim", selectedData.LOK_TUM_YOL);
                    }}
                  />
                  <Button onClick={handleLokasyonMinusClick}> - </Button>
                </div>
                <Controller
                  name="tamLokasyonTanim"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      style={{ width: "300px" }}
                      disabled
                      type="text" // Set the type to "text" for name input
                    />
                  )}
                />
              </div>

              {errors.lokasyonTanim && (
                <div style={{ color: "red", marginTop: "5px" }}>{errors.lokasyonTanim.message}</div>
              )}
            </div>
          </StyledDivMedia>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "755px",
              }}>
              <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.makine ? "600" : "normal" }}>Makine:</Text>
              <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "300px",
                    }}>
                    <Controller
                      name="makine"
                      control={control}
                      rules={{ required: fieldRequirements.makine ? "Alan Boş Bırakılamaz!" : false }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          status={errors.makine ? "error" : ""}
                          type="text" // Set the type to "text" for name input
                          style={{ width: "215px" }}
                          disabled
                        />
                      )}
                    />
                    <Controller
                      name="makineID"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text" // Set the type to "text" for name input
                          style={{ display: "none" }}
                        />
                      )}
                    />
                    <MakineTablo
                      onSubmit={(selectedData) => {
                        setValue("makine", selectedData.MKN_KOD);
                        setValue("makineID", selectedData.key);
                        setValue("makineTanim", selectedData.MKN_TANIM);
                        setValue("lokasyonID", selectedData.MKN_LOKASYON_ID);
                        setValue("lokasyonTanim", selectedData.MKN_LOKASYON);
                        setValue("tamLokasyonTanim", selectedData.MKN_LOKASYON_TUM_YOL);
                        setValue("makineDurumu", selectedData.MKN_DURUM);
                        setValue("makineDurumuID", selectedData.MKN_DURUM_KOD_ID);
                        setValue("garantiBitis", formatDate(selectedData.MKN_GARANTI_BITIS));
                      }}
                    />
                    <Button onClick={handleMakineMinusClick}> - </Button>
                  </div>
                  <Controller
                    name="makineTanim"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ width: "300px" }}
                        disabled
                      />
                    )}
                  />
                </div>
                {errors.makine && <div style={{ color: "red", marginTop: "5px" }}>{errors.makine.message}</div>}
              </div>
            </StyledDivBottomLine>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "755px",
              }}>
              <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.garantiBitis ? "600" : "normal" }}>
                Garanti Bitiş:
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "300px",
                    }}>
                    <Controller
                      name="garantiBitis"
                      control={control}
                      rules={{ required: fieldRequirements.garantiBitis ? "Alan Boş Bırakılamaz!" : false }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          status={errors.garantiBitis ? "error" : ""}
                          type="text" // Set the type to "text" for name input
                          style={{ width: "300px" }}
                          disabled
                        />
                      )}
                    />
                  </div>
                  <Text
                    style={{
                      fontSize: "14px",
                      width: "300px",
                      color: garantiDurumu === "Garanti süresi doldu." ? "red" : "green",
                    }}>
                    {garantiDurumu}
                  </Text>
                </div>
                {errors.garantiBitis && (
                  <div style={{ color: "red", marginTop: "5px" }}>{errors.garantiBitis.message}</div>
                )}
              </div>
            </StyledDivBottomLine>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "755px",
              }}>
              <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.ekipman ? "600" : "normal" }}>
                Ekipman:
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "300px",
                    }}>
                    <Controller
                      name="ekipman"
                      control={control}
                      rules={{ required: fieldRequirements.ekipman ? "Alan Boş Bırakılamaz!" : false }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          status={errors.ekipman ? "error" : ""}
                          type="text" // Set the type to "text" for name input
                          style={{ width: "215px" }}
                          disabled
                        />
                      )}
                    />
                    <Controller
                      name="ekipmanID"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text" // Set the type to "text" for name input
                          style={{ display: "none" }}
                        />
                      )}
                    />
                    <EkipmanTablo
                      onSubmit={(selectedData) => {
                        setValue("ekipman", selectedData.EKP_KOD);
                        setValue("ekipmanID", selectedData.key);
                        setValue("ekipmanTanim", selectedData.EKP_TANIM);
                      }}
                    />
                    <Button onClick={handleEkipmanMinusClick}> - </Button>
                  </div>
                  <Controller
                    name="ekipmanTanim"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ width: "300px" }}
                        disabled
                      />
                    )}
                  />
                </div>
                {errors.ekipman && <div style={{ color: "red", marginTop: "5px" }}>{errors.ekipman.message}</div>}
              </div>
            </StyledDivBottomLine>
          </div>
          <div style={{ display: "flex", width: "100%", maxWidth: "755px", gap: "5px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.makineDurumu ? "600" : "normal" }}>
                Makine Durumu:
              </Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "300px",
                  gap: "10px",
                  width: "100%",
                }}>
                <MakineDurumu fieldRequirements={fieldRequirements} />
              </div>
            </StyledDivBottomLine>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "300px",
              }}>
              <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.sayac ? "600" : "normal" }}>Sayaç:</Text>
              <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Controller
                    name="sayac"
                    control={control}
                    rules={{ required: fieldRequirements.sayac ? "Alan Boş Bırakılamaz!" : false }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        status={errors.sayac ? "error" : ""}
                        type="number" // Set the type to "text" for name input
                        style={{ width: "225px" }}
                      />
                    )}
                  />
                </div>

                {errors.sayac && <div style={{ color: "red", marginTop: "5px" }}>{errors.sayac.message}</div>}
              </div>
            </StyledDivBottomLine>
          </div>
        </div>
      </div>
    </div>
  );
}
