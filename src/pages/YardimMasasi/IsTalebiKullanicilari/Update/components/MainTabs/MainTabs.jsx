import React, { useEffect, useState } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, ColorPicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import BakimTipi from "./components/BakimTipi";
import styled from "styled-components";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/tr"; // Örnek olarak Türkçe yerel ayarını ekliyoruz
import customParseFormat from "dayjs/plugin/customParseFormat";
import LokasyonTablo from "./components/LokasyonTablo.jsx";
import PersonelTablo from "./components/PersonelTablo.jsx";
import Departman from "./components/Departman.jsx";

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
    align-items: center;
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

export default function MainTabs() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Kullanıcının yerel ayarına göre tarih formatını ayarlayın
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  const handleDepoMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
  };

  const handlePersonelMinusClick = () => {
    setValue("personelTanimi", "");
    setValue("personelID", "");
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "15px", gap: "20px" }}>
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
      <div style={{ display: "flex", marginBottom: "15px", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "450px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Kullanıcı Kodu:</Text>
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
              name="ekipmanKodu"
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
              name="secilenID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <Controller
              name="aktif"
              control={control}
              defaultValue={true} // or true if you want it checked by default
              render={({ field }) => (
                <Checkbox style={{ marginTop: "5px" }} checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Aktif
                </Checkbox>
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "450px", gap: "10px", width: "100%", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Kullanıcı Adı:</Text>
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
              name="ekipmanTanimi"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                  {error && <div style={{ color: "red" }}>{error.message}</div>}
                </div>
              )}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "450px", gap: "10px", width: "100%" }}>
          <BakimTipi />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "450px", gap: "10px", width: "100%", justifyContent: "space-between" }}>
            <Text style={{ fontSize: "14px" }}>Ünvan:</Text>
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
                name="unvan"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                    <Input {...field} style={{ flex: 1 }} />
                  </div>
                )}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "450px", gap: "10px", width: "100%", justifyContent: "space-between" }}>
            <Text style={{ fontSize: "14px" }}>Personel:</Text>
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
                name="personelTanimi"
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
                name="personelID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <PersonelTablo
                onSubmit={(selectedData) => {
                  setValue("personelTanimi", selectedData.subject);
                  setValue("personelID", selectedData.key);
                }}
              />
              <Button onClick={handlePersonelMinusClick}> - </Button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "450px", gap: "10px", width: "100%" }}>
          <Departman />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px" }}>
          <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", width: "300px" }}>
            <Controller
              name="lokasyonTanim"
              control={control}
              // rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  // status={errors.lokasyonTanim ? "error" : ""}
                  type="text" // Set the type to "text" for name input
                  style={{ width: "215px" }}
                  disabled
                />
              )}
            />
            <Controller
              name="lokasyonID"
              control={control}
              // rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  // status={errors.lokasyonID ? "error" : ""}
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
            <Button onClick={handleDepoMinusClick}> - </Button>
            {/*{(errors.lokasyonTanim || errors.lokasyonID) && <div style={{ color: "red", marginTop: "5px" }}>Alan Boş Bırakılamaz!</div>}*/}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "450px", gap: "10px", width: "100%", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px" }}>Mail:</Text>
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
              name="mail"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <Input {...field} style={{ flex: 1 }} />
                </div>
              )}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "450px", gap: "10px", width: "100%", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px" }}>Şifre:</Text>
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
              name="sifre"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <Input {...field} style={{ flex: 1 }} />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
