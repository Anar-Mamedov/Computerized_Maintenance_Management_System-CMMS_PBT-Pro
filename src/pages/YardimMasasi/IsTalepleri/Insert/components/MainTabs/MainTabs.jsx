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
import KullaniciTablo from "./components/KullaniciTablo";
import IletisimSekli from "./components/IletisimSekli";
import TalepTipi from "./components/TalepTipi";
import IsKategorisi from "./components/IsKategorisi";
import ServisNedeni from "./components/ServisNedeni";
import BildirilenBina from "./components/BildirilenBina";
import BildirilenKat from "./components/BildirilenKat";
import OncelikTablo from "./components/OncelikTablo";

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

export default function MainTabs({
  drawerOpen,
  isDisabled,
  fieldRequirements,
}) {
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const otonomBakimValue = watch("otonomBakim");

  // duzenlenmeTarihi ve duzenlenmeSaati alanlarının boş ve ye sistem tarih ve saatinden büyük olup olmadığını kontrol etmek için bir fonksiyon

  const validateDateTime = (value) => {
    const date = watch("talepTarihi");
    const time = watch("talepSaati");
    if (!date || !time) {
      return "Alan Boş Bırakılamaz!";
    }
    const currentTime = dayjs();
    const inputDateTime = dayjs(
      `${dayjs(date).format("YYYY-MM-DD")} ${dayjs(time).format("HH:mm")}`
    );
    if (inputDateTime.isAfter(currentTime)) {
      return "Düzenlenme tarihi ve saati mevcut tarih ve saatten büyük olamaz";
    }
    return true;
  };

  // duzenlenmeTarihi ve duzenlenmeSaati alanlarının boş ve ye sistem tarih ve saatinden büyük olup olmadığını kontrol etmek için bir fonksiyon sonu

  const handleTalepteBulunanMinusClick = () => {
    setValue("talepteBulunan", "");
    setValue("talepteBulunanID", "");
  };

  const handleIlgiliKisiMinusClick = () => {
    setValue("ilgiliKisi", "");
    setValue("ilgiliKisiID", "");
  };

  const handleOncelikMinusClick = () => {
    setValue("oncelikTanim", "");
    setValue("oncelikID", "");
  };

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
  };

  // sistemin o anki tarih ve saatini almak için

  useEffect(() => {
    if (drawerOpen) {
      const currentDate = dayjs(); // Şu anki tarih için dayjs nesnesi
      const currentTime = dayjs(); // Şu anki saat için dayjs nesnesi

      // Tarih ve saat alanlarını güncelle
      setValue("talepTarihi", currentDate);
      setValue("talepSaati", currentTime);
    }
  }, [drawerOpen, setValue]);

  // sistemin o anki tarih ve saatini almak sonu

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(
      formattedSampleDate
        .replace("2021", "YYYY")
        .replace("21", "DD")
        .replace("11", "MM")
    );

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
      hour: "numeric",
      minute: "numeric",
    });
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
      }}
    >
      <div style={{ display: "flex", width: "100%", gap: "20px" }}>
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
          }}
        >
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>
            Talep Kodu:
          </Text>
          <div
            style={{
              display: "flex",
              // flexWrap: "wrap",
              alignItems: "flex-start",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller
              name="talepKodu"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    width: "100%",
                  }}
                >
                  <Input
                    {...field}
                    status={error ? "error" : ""}
                    style={{ flex: 1 }}
                  />
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
          }}
        >
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>
            Talep Tarihi:
          </Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller
              name="talepTarihi"
              control={control}
              rules={{ validate: validateDateTime }}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  status={error ? "error" : ""}
                  disabled={!isDisabled}
                  style={{ width: "180px" }}
                  format={localeDateFormat}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
            <Controller
              name="talepSaati"
              control={control}
              rules={{ validate: validateDateTime }}
              render={({ field, fieldState: { error } }) => (
                <TimePicker
                  {...field}
                  changeOnScroll needConfirm={false}
                  status={error ? "error" : ""}
                  disabled={!isDisabled}
                  style={{ width: "110px" }}
                  format={localeTimeFormat}
                  placeholder="Saat seçiniz"
                />
              )}
            />
            {errors.talepSaati && (
              <div style={{ color: "red" }}>{errors.talepSaati.message}</div>
            )}
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
          }}
        >
          <Text style={{ fontSize: "14px" }}>Kapanma Tarihi:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller
              name="kapanmaTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  disabled
                  style={{ width: "180px" }}
                  format={localeDateFormat}
                  placeholder=""
                />
              )}
            />
            <Controller
              name="kapanmaSaati"
              control={control}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  changeOnScroll needConfirm={false}
                  disabled
                  style={{ width: "110px" }}
                  format={localeTimeFormat}
                  placeholder=""
                />
              )}
            />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <div
          style={{
            display: "flex",
            marginBottom: "15px",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "450px",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: "600" }}>
                Talepte Bulunan:
              </Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <Controller
                  name="talepteBulunan"
                  control={control}
                  rules={{ required: "Alan Boş Bırakılamaz!" }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      status={errors.talepteBulunan ? "error" : ""}
                      type="text" // Set the type to "text" for name input
                      style={{ width: "215px" }}
                      disabled
                    />
                  )}
                />
                <Controller
                  name="talepteBulunanID"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      style={{ display: "none" }}
                    />
                  )}
                />
                <KullaniciTablo
                  onSubmit={(selectedData) => {
                    setValue("talepteBulunan", selectedData.ISK_ISIM);
                    setValue("talepteBulunanID", selectedData.key);
                    setValue("lokasyonTanim", selectedData.ISK_LOKASYON);
                    setValue("lokasyonID", selectedData.ISK_LOKASYON_ID);
                    setValue("departman", selectedData.ISK_DEPARTMAN);
                    setValue("departmanID", selectedData.ISK_DEPARTMAN_ID);
                    setValue("irtibatTelefonu", selectedData.ISK_TELEFON_1);
                    setValue("email", selectedData.ISK_MAIL);
                  }}
                />
                <Button onClick={handleTalepteBulunanMinusClick}> - </Button>
                {errors.talepteBulunan && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errors.talepteBulunan.message}
                  </div>
                )}
              </div>
            </StyledDivBottomLine>
          </div>
          <StyledDivMedia
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "450px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                fontWeight: fieldRequirements.lokasyonTanim ? "600" : "normal",
              }}
            >
              Lokasyon:
            </Text>
            <div>
              <div
                className="anar"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: "300px",
                  gap: "3px",
                }}
              >
                <Controller
                  name="lokasyonTanim"
                  control={control}
                  rules={{
                    required: fieldRequirements.lokasyonTanim
                      ? "Alan Boş Bırakılamaz!"
                      : false,
                  }}
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
                  }}
                />
                <Button onClick={handleLokasyonMinusClick}> - </Button>
              </div>
              {errors.lokasyonTanim && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.lokasyonTanim.message}
                </div>
              )}
            </div>
          </StyledDivMedia>
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.departman ? "600" : "normal",
                }}
              >
                Departman:
              </Text>
              <Departman fieldRequirements={fieldRequirements} />
            </StyledDivBottomLine>
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
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                fontWeight: fieldRequirements.irtibatTelefonu
                  ? "600"
                  : "normal",
              }}
            >
              İrtibat Telefonu:
            </Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                maxWidth: "300px",
                minWidth: "300px",
                width: "100%",
                flexDirection: "column",
              }}
            >
              <Controller
                name="irtibatTelefonu"
                control={control}
                rules={{
                  required: fieldRequirements.irtibatTelefonu
                    ? "Alan Boş Bırakılamaz!"
                    : false,
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    status={errors.irtibatTelefonu ? "error" : ""}
                    style={{ flex: 1 }}
                  />
                )}
              />
              {errors.irtibatTelefonu && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.irtibatTelefonu.message}
                </div>
              )}
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
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                fontWeight: fieldRequirements.email ? "600" : "normal",
              }}
            >
              E-Mail:
            </Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                maxWidth: "300px",
                minWidth: "300px",
                width: "100%",
                flexDirection: "column",
              }}
            >
              <Controller
                name="email"
                control={control}
                rules={{
                  required: fieldRequirements.email
                    ? "Alan Boş Bırakılamaz!"
                    : false,
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    status={errors.email ? "error" : ""}
                    style={{ flex: 1 }}
                  />
                )}
              />
              {errors.email && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.email.message}
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginBottom: "15px",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.iletisimSekli
                    ? "600"
                    : "normal",
                }}
              >
                İletişim Şekli:
              </Text>
              <IletisimSekli fieldRequirements={fieldRequirements} />
            </StyledDivBottomLine>
          </div>
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.talepTipi ? "600" : "normal",
                }}
              >
                Talep Tipi:
              </Text>
              <TalepTipi fieldRequirements={fieldRequirements} />
            </StyledDivBottomLine>
          </div>
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.isKategorisi ? "600" : "normal",
                }}
              >
                İş Kategorisi:
              </Text>
              <IsKategorisi fieldRequirements={fieldRequirements} />
            </StyledDivBottomLine>
          </div>
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.servisNedeni ? "600" : "normal",
                }}
              >
                Servis Nedeni:
              </Text>
              <ServisNedeni fieldRequirements={fieldRequirements} />
            </StyledDivBottomLine>
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
            }}
          >
            <Text style={{ fontSize: "14px" }}>Atölye:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "300px",
                minWidth: "300px",
                gap: "10px",
                width: "100%",
              }}
            >
              <Controller
                name="atolye"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled style={{ flex: 1 }} />
                )}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginBottom: "15px",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "450px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.oncelikTanim ? "600" : "normal",
                }}
              >
                Öncelik:
              </Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <Controller
                  name="oncelikTanim"
                  control={control}
                  rules={{
                    required: fieldRequirements.oncelikTanim
                      ? "Alan Boş Bırakılamaz!"
                      : false,
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      status={errors.oncelikTanim ? "error" : ""}
                      type="text" // Set the type to "text" for name input
                      style={{ width: "215px" }}
                      disabled
                    />
                  )}
                />
                <Controller
                  name="oncelikID"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      style={{ display: "none" }}
                    />
                  )}
                />
                <OncelikTablo
                  onSubmit={(selectedData) => {
                    setValue("oncelikTanim", selectedData.subject);
                    setValue("oncelikID", selectedData.key);
                  }}
                />
                <Button onClick={handleOncelikMinusClick}> - </Button>
                {errors.oncelikTanim && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errors.oncelikTanim.message}
                  </div>
                )}
              </div>
            </StyledDivBottomLine>
          </div>
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.bildirilenBina
                    ? "600"
                    : "normal",
                }}
              >
                Bildirilen Bina:
              </Text>
              <BildirilenBina fieldRequirements={fieldRequirements} />
            </StyledDivBottomLine>
          </div>
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.bildirilenKat
                    ? "600"
                    : "normal",
                }}
              >
                Bildirilen Kat:
              </Text>
              <BildirilenKat fieldRequirements={fieldRequirements} />
            </StyledDivBottomLine>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "450px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.ilgiliKisi ? "600" : "normal",
                }}
              >
                İlgili Kişi:
              </Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <Controller
                  name="ilgiliKisi"
                  control={control}
                  rules={{
                    required: fieldRequirements.ilgiliKisi
                      ? "Alan Boş Bırakılamaz!"
                      : false,
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      status={errors.ilgiliKisi ? "error" : ""}
                      type="text" // Set the type to "text" for name input
                      style={{ width: "215px" }}
                      disabled
                    />
                  )}
                />
                <Controller
                  name="ilgiliKisiID"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      style={{ display: "none" }}
                    />
                  )}
                />
                <KullaniciTablo
                  onSubmit={(selectedData) => {
                    setValue("ilgiliKisi", selectedData.ISK_ISIM);
                    setValue("ilgiliKisiID", selectedData.key);
                  }}
                />
                <Button onClick={handleIlgiliKisiMinusClick}> - </Button>
                {errors.ilgiliKisi && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errors.ilgiliKisi.message}
                  </div>
                )}
              </div>
            </StyledDivBottomLine>
          </div>
        </div>
      </div>
    </div>
  );
}
