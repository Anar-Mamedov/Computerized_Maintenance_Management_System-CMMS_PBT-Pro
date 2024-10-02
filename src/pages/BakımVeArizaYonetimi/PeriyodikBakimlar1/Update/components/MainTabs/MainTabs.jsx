import React from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, ColorPicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import BakimTipi from "./components/BakimTipi";
import styled from "styled-components";
import LokasyonTablo from "./components/LokasyonTablo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import BakimGrubu from "./components/BakimGrubu";
import BakimNedeni from "./components/BakimNedeni";
import OncelikTablo from "./components/OncelikTablo";
import TalimatTablo from "./components/TalimatTablo";
import AtolyeTablo from "./components/AtolyeTablo";
import FirmaTablo from "./components/FirmaTablo";
import Periyot from "./components/Periyot";
import SecondTabs from "../SecondTabs/SecondTabs";

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
    formState: { errors },
  } = useFormContext();

  const otonomBakimValue = watch("otonomBakim");

  const handleMinusClick = () => {
    setValue("lokasyonMasrafMerkeziTanim", "");
    setValue("lokasyonMasrafMerkeziID", "");
  };

  const handleOncelikMinusClick = () => {
    setValue("oncelikTanim", "");
    setValue("oncelikID", "");
  };

  const handleTalimatMinusClick = () => {
    setValue("talimatTanim", "");
    setValue("talimatID", "");
  };

  const handleAtolyeMinusClick = () => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
  };

  const handleFirmaMinusClick = () => {
    setValue("firmaTanim", "");
    setValue("firmaID", "");
  };

  const handleDepoMinusClick = () => {
    setValue("lokasyonDepoTanim", "");
    setValue("lokasyonDepoID", "");
  };

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "15px",
        gap: "20px",
      }}
    >
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
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Bakım Kodu:</Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "5px", width: "100%" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
              <Controller
                name="bakimKodu"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field }) => <Input {...field} status={errors.bakimKodu ? "error" : ""} style={{ flex: 1 }} />}
              />
              <Controller
                name="secilenBakimID"
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
                name="bakimAktif"
                control={control}
                defaultValue={true} // or true if you want it checked by default
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                    Aktif
                  </Checkbox>
                )}
              />
            </div>
            {errors.bakimKodu && <div style={{ color: "red" }}>{errors.bakimKodu.message}</div>}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "450px", gap: "10px", width: "100%", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Bakım Tanımı:</Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <Controller
              name="bakimTanimi"
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
          }}
        >
          <BakimTipi />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
          }}
        >
          <BakimGrubu />
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
            <Text style={{ fontSize: "14px" }}>Öncelik:</Text>
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
            <Text style={{ fontSize: "14px" }}>Talimat:</Text>
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
                name="talimatTanim"
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
                name="talimatID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <TalimatTablo
                onSubmit={(selectedData) => {
                  setValue("talimatTanim", selectedData.subject);
                  setValue("talimatID", selectedData.key);
                }}
              />
              <Button onClick={handleTalimatMinusClick}> - </Button>
            </div>
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
            <Text style={{ fontSize: "14px" }}>Atölye:</Text>
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
                name="atolyeTanim"
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
                name="atolyeID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <AtolyeTablo
                onSubmit={(selectedData) => {
                  setValue("atolyeTanim", selectedData.subject);
                  setValue("atolyeID", selectedData.key);
                }}
              />
              <Button onClick={handleAtolyeMinusClick}> - </Button>
            </div>
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
            <Text style={{ fontSize: "14px" }}>Firma:</Text>
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
                name="firmaTanim"
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
                name="firmaID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <FirmaTablo
                onSubmit={(selectedData) => {
                  setValue("firmaTanim", selectedData.subject);
                  setValue("firmaID", selectedData.key);
                }}
              />
              <Button onClick={handleFirmaMinusClick}> - </Button>
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
          <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
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
              render={({ field }) => (
                <Input
                  {...field}
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
        </StyledDivMedia>
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
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Çalışma Süresis (dk.):</Text>
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
              name="calismaSuresi"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    const value = field.value;
                    // Rakam veya bir virgül olup olmadığını kontrol et
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </div>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Duruş Süresis (dk.):</Text>
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
              name="durusSuresi"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    const value = field.value;
                    // Rakam veya bir virgül olup olmadığını kontrol et
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
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
          }}
        >
          <Text style={{ fontSize: "14px" }}>Personel (kişi):</Text>
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
              name="personelSayisi"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    // Sadece rakam girişine izin ver
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
      </div>
      <SecondTabs />
    </div>
  );
}
