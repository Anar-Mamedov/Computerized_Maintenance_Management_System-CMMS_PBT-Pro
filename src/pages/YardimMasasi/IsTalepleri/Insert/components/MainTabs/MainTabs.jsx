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
import PersonelTipi from "./components/PersonelTipi";
import styled from "styled-components";
import LokasyonTablo from "./components/LokasyonTablo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Departman from "./components/Departman";
import Gorevi from "./components/Gorevi";
import TaseronTablo from "./components/TaseronTablo";
import KullaniciTablo from "./components/KullaniciTablo";
import IdariAmiriTablo from "./components/IdariAmiriTablo";
import MasrafMerkeziTablo from "./components/MasrafMerkeziTablo";

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

export default function MainTabs({ drawerOpen }) {
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
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

  const handleTaseronMinusClick = () => {
    setValue("taseronTanim", "");
    setValue("taseronID", "");
  };

  const handlePersonelHesabiMinusClick = () => {
    setValue("personelHesabiTanim", "");
    setValue("personelHesabiID", "");
  };

  const handleTalepteBulunanMinusClick = () => {
    setValue("talepteBulunan", "");
    setValue("talepteBulunanID", "");
  };

  const handleIdariAmiriMinusClick = () => {
    setValue("idariAmiriTanim", "");
    setValue("idariAmiriID", "");
  };

  const handleMasrafMerkeziMinusClick = () => {
    setValue("masrafMerkeziTanim", "");
    setValue("masrafMerkeziID", "");
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
      }}>
      <div
        style={{
          display: "flex",
          marginBottom: "15px",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "10px",
            rowGap: "0px",
          }}>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Talep Kodu:</Text>
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
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Talep Tarihi:</Text>
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
              name="talepTarihi"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  status={error ? "error" : ""}
                  style={{ width: "180px" }}
                  format={localeDateFormat}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
            <Controller
              name="talepSaati"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <TimePicker
                  {...field}
                  status={errors.talepSaati ? "error" : ""}
                  style={{ width: "110px" }}
                  format={localeTimeFormat}
                  placeholder="Saat seçiniz"
                />
              )}
            />
            {errors.talepSaati && <div style={{ color: "red" }}>{errors.talepSaati.message}</div>}
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
            }}>
            <Controller
              name="kapanmaTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} disabled style={{ width: "180px" }} format={localeDateFormat} placeholder="" />
              )}
            />
            <Controller
              name="kapanmaSaati"
              control={control}
              render={({ field }) => (
                <TimePicker {...field} disabled style={{ width: "110px" }} format={localeTimeFormat} placeholder="" />
              )}
            />
          </div>
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
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>Talepte Bulunan:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
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
                  setValue("talepteBulunan", selectedData.subject);
                  setValue("talepteBulunanID", selectedData.key);
                }}
              />
              <Button onClick={handleTalepteBulunanMinusClick}> - </Button>
              {errors.talepteBulunan && (
                <div style={{ color: "red", marginTop: "5px" }}>{errors.talepteBulunan.message}</div>
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
          }}>
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
            }}>
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
        <div style={{ width: "100%", maxWidth: "450px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Departman:</Text>
            <Departman />
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
          }}>
          <Text style={{ fontSize: "14px" }}>Personel Adı:</Text>
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
              name="personelAdi"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
          }}>
          <PersonelTipi />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
          }}>
          <Departman />
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
        }}>
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
            }}>
            <Controller
              name="unvan"
              control={control}
              render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
          }}>
          <Gorevi />
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
            <Text style={{ fontSize: "14px" }}>Taşeron:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="taseronTanim"
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
                name="taseronID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <TaseronTablo
                onSubmit={(selectedData) => {
                  setValue("taseronTanim", selectedData.subject);
                  setValue("taseronID", selectedData.key);
                }}
              />
              <Button onClick={handleTaseronMinusClick}> - </Button>
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
            <Text style={{ fontSize: "14px" }}>İdari Amiri:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="idariAmiriTanim"
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
                name="idariAmiriID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <IdariAmiriTablo
                onSubmit={(selectedData) => {
                  setValue("idariAmiriTanim", selectedData.subject);
                  setValue("idariAmiriID", selectedData.key);
                }}
              />
              <Button onClick={handleIdariAmiriMinusClick}> - </Button>
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
            <Text style={{ fontSize: "14px" }}>Masraf Merkezi:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="masrafMerkeziTanim"
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
                name="masrafMerkeziID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <MasrafMerkeziTablo
                onSubmit={(selectedData) => {
                  setValue("masrafMerkeziTanim", selectedData.age);
                  setValue("masrafMerkeziID", selectedData.key);
                }}
              />
              <Button onClick={handleMasrafMerkeziMinusClick}> - </Button>
            </div>
          </StyledDivBottomLine>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          // flexWrap: "wrap",
          marginBottom: "15px",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
        }}>
        <div>
          <Controller
            name="teknisyen"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Teknisyen
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="operator"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Operatör
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="bakim"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Bakım
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="santiye"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Şantiye
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="surucu"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Sürücü
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="diger"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Diğer
              </Checkbox>
            )}
          />
        </div>
      </div>
    </div>
  );
}
