import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker, Slider, InputNumber, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import ProsedurTablo from "./components/ProsedurTablo";
import ProsedurTipi from "./components/ProsedurTipi";
import ProsedurNedeni from "./components/ProsedurNedeni";
import OncelikTablo from "./components/OncelikTablo";
import AtolyeTablo from "./components/AtolyeTablo";
import TalimatTablo from "./components/TalimatTablo";
import TakvimTablo from "./components/TakvimTablo";
import MasrafMerkeziTablo from "./components/MasrafMerkeziTablo";
import ProjeTablo from "./components/ProjeTablo";
import FirmaTablo from "./components/FirmaTablo";
import SozlesmeTablo from "./components/SozlesmeTablo";

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

export default function DetayBilgiler({ fieldRequirements }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format

  const prosedurTab = watch("prosedurTab");

  const handleProsedurMinusClick = () => {
    setValue("prosedur", "");
    setValue("prosedurID", "");
    setValue("konu", "");
    setValue("prosedurTipi", null);
    setValue("prosedurTipiID", "");
    setValue("prosedurNedeni", null);
    setValue("prosedurNedeniID", "");
  };

  // prosedurTab değişikliğini izleyin ve değişiklik olduğunda handleProsedurMinusClick fonksiyonunu çalıştırın.
  useEffect(() => {
    handleProsedurMinusClick();
  }, [prosedurTab]); // prosedurTab'ı dependency array'e ekleyin.

  const handleOncelikMinusClick = () => {
    setValue("oncelikTanim", "");
    setValue("oncelikID", "");
  };

  const handleAtolyeMinusClick = () => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
  };

  const handleTalimatMinusClick = () => {
    setValue("talimatTanim", "");
    setValue("talimatID", "");
  };

  const handleTakvimMinusClick = () => {
    setValue("takvimTanim", "");
    setValue("takvimID", "");
  };

  const handleMasrafMerkeziMinusClick = () => {
    setValue("masrafMerkezi", "");
    setValue("masrafMerkeziID", "");
  };
  const handleProjeMinusClick = () => {
    setValue("proje", "");
    setValue("projeID", "");
  };

  const handleFirmaMinusClick = () => {
    setValue("firma", "");
    setValue("firmaID", "");
  };

  const handleSozlesmeMinusClick = () => {
    setValue("sozlesme", "");
    setValue("sozlesmeID", "");
  };

  // date picker için tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

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

  //! Başlama Tarihi ve saati ile Bitiş Tarihi ve saati arasındaki farkı hesaplama

  // Watch for changes in the relevant fields
  const watchFields = watch(["baslamaZamani", "baslamaZamaniSaati", "bitisZamani", "bitisZamaniSaati"]);

  React.useEffect(() => {
    const { baslamaZamani, baslamaZamaniSaati, bitisZamani, bitisZamaniSaati } = getValues();
    if (baslamaZamani && baslamaZamaniSaati && bitisZamani && bitisZamaniSaati) {
      // Başlangıç ve bitiş tarih/saatini birleştir
      const startDateTime = dayjs(baslamaZamani).hour(baslamaZamaniSaati.hour()).minute(baslamaZamaniSaati.minute());
      const endDateTime = dayjs(bitisZamani).hour(bitisZamaniSaati.hour()).minute(bitisZamaniSaati.minute());

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
      <div style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            width: "100%",
            maxWidth: "875px",
          }}
        >
          <div>
            <div
              style={{
                borderBottom: "1px solid #e8e8e8",
                marginBottom: "15px",
                paddingBottom: "5px",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#0062ff",
                }}
              >
                İş Bilgileri
              </Text>
            </div>
            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
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
                        fontWeight: fieldRequirements.prosedur ? "600" : "normal",
                      }}
                    >
                      Prosedür:
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
                        name="prosedur"
                        control={control}
                        rules={{
                          required: fieldRequirements.prosedur ? "Alan Boş Bırakılamaz!" : false,
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            status={errors.prosedur ? "error" : ""}
                            type="text" // Set the type to "text" for name input
                            style={{ width: "215px" }}
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name="prosedurID"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text" // Set the type to "text" for name input
                            style={{ display: "none" }}
                          />
                        )}
                      />
                      <ProsedurTablo
                        onSubmit={(selectedData) => {
                          setValue("prosedur", selectedData.IST_KOD);
                          setValue("prosedurID", selectedData.key);
                          setValue("konu", selectedData.IST_TANIM);
                          setValue("prosedurTipi", selectedData.IST_TIP);
                          setValue("prosedurTipiID", selectedData.IST_TIP_KOD_ID);
                          setValue("prosedurNedeni", selectedData.IST_NEDEN);
                          setValue("prosedurNedeniID", selectedData.IST_NEDEN_KOD_ID);
                        }}
                      />
                      <Button onClick={handleProsedurMinusClick}> - </Button>
                      {errors.prosedur && <div style={{ color: "red", marginTop: "5px" }}>{errors.prosedur.message}</div>}
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
                        fontWeight: fieldRequirements.konu ? "600" : "normal",
                      }}
                    >
                      Konu:
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        maxWidth: "300px",
                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <Controller
                        name="konu"
                        control={control}
                        rules={{
                          required: fieldRequirements.konu ? "Alan Boş Bırakılamaz!" : false,
                        }}
                        render={({ field }) => <Input {...field} status={errors.konu ? "error" : ""} style={{ flex: 1 }} />}
                      />
                      {errors.konu && <div style={{ color: "red", marginTop: "5px" }}>{errors.konu.message}</div>}
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
                        fontWeight: fieldRequirements.prosedurTipi ? "600" : "normal",
                      }}
                    >
                      Tipi:
                    </Text>
                    <ProsedurTipi fieldRequirements={fieldRequirements} />
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
                        fontWeight: fieldRequirements.prosedurNedeni ? "600" : "normal",
                      }}
                    >
                      Nedeni:
                    </Text>
                    <ProsedurNedeni fieldRequirements={fieldRequirements} />
                  </StyledDivBottomLine>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                  width: "100%",
                  maxWidth: "415px",
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
                          required: fieldRequirements.oncelikTanim ? "Alan Boş Bırakılamaz!" : false,
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
                      {errors.oncelikTanim && <div style={{ color: "red", marginTop: "5px" }}>{errors.oncelikTanim.message}</div>}
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
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: fieldRequirements.atolyeTanim ? "600" : "normal",
                      }}
                    >
                      Atölye:
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
                        name="atolyeTanim"
                        control={control}
                        rules={{
                          required: fieldRequirements.atolyeTanim ? "Alan Boş Bırakılamaz!" : false,
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            status={errors.atolyeTanim ? "error" : ""}
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
                      {errors.atolyeTanim && <div style={{ color: "red", marginTop: "5px" }}>{errors.atolyeTanim.message}</div>}
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
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: fieldRequirements.takvimTanim ? "600" : "normal",
                      }}
                    >
                      Takvim:
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
                        name="takvimTanim"
                        control={control}
                        rules={{
                          required: fieldRequirements.takvimTanim ? "Alan Boş Bırakılamaz!" : false,
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            status={errors.takvimTanim ? "error" : ""}
                            type="text" // Set the type to "text" for name input
                            style={{ width: "215px" }}
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name="takvimID"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text" // Set the type to "text" for name input
                            style={{ display: "none" }}
                          />
                        )}
                      />
                      <TakvimTablo
                        onSubmit={(selectedData) => {
                          setValue("takvimTanim", selectedData.TKV_TANIM);
                          setValue("takvimID", selectedData.key);
                        }}
                      />
                      <Button onClick={handleTakvimMinusClick}> - </Button>
                      {errors.takvimTanim && <div style={{ color: "red", marginTop: "5px" }}>{errors.takvimTanim.message}</div>}
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
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: fieldRequirements.talimatTanim ? "600" : "normal",
                      }}
                    >
                      Talimat:
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
                        name="talimatTanim"
                        control={control}
                        rules={{
                          required: fieldRequirements.talimatTanim ? "Alan Boş Bırakılamaz!" : false,
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            status={errors.talimatTanim ? "error" : ""}
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
                      {errors.talimatTanim && <div style={{ color: "red", marginTop: "5px" }}>{errors.talimatTanim.message}</div>}
                    </div>
                  </StyledDivBottomLine>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "column",
                width: "100%",
                maxWidth: "450px",
              }}
            >
              <div
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "5px",
                  paddingBottom: "5px",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#0062ff",
                  }}
                >
                  İş Talebi
                </Text>
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
                      fontWeight: fieldRequirements.isTalebiKodu ? "600" : "normal",
                    }}
                  >
                    İş Talebi Kodu:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "300px",
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <Controller
                      name="isTalebiKodu"
                      control={control}
                      rules={{
                        required: fieldRequirements.isTalebiKodu ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field }) => <Input {...field} disabled status={errors.isTalebiKodu ? "error" : ""} style={{ flex: 1 }} />}
                    />
                    {errors.isTalebiKodu && <div style={{ color: "red", marginTop: "5px" }}>{errors.isTalebiKodu.message}</div>}
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
                      fontWeight: fieldRequirements.talepEden ? "600" : "normal",
                    }}
                  >
                    Talep Eden:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "300px",
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <Controller
                      name="talepEden"
                      control={control}
                      rules={{
                        required: fieldRequirements.talepEden ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field }) => <Input {...field} disabled status={errors.talepEden ? "error" : ""} style={{ flex: 1 }} />}
                    />
                    {errors.talepEden && <div style={{ color: "red", marginTop: "5px" }}>{errors.talepEden.message}</div>}
                  </div>
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
                    fontWeight: fieldRequirements.isTalebiTarihi ? "600" : "normal",
                  }}
                >
                  Tarih:
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
                    name="isTalebiTarihi"
                    control={control}
                    rules={{
                      required: fieldRequirements.isTalebiTarihi ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        status={errors.isTalebiTarihi ? "error" : ""}
                        // disabled={!isDisabled}
                        disabled
                        style={{ width: "180px" }}
                        format={localeDateFormat}
                        placeholder="Tarih seçiniz"
                      />
                    )}
                  />
                  <Controller
                    name="isTalebiSaati"
                    control={control}
                    rules={{
                      required: fieldRequirements.isTalebiSaati ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TimePicker
                        {...field}
                        changeOnScroll
                        needConfirm={false}
                        status={errors.isTalebiSaati ? "error" : ""}
                        // disabled={!isDisabled}
                        disabled
                        style={{ width: "110px" }}
                        format={localeTimeFormat}
                        placeholder="Saat seçiniz"
                      />
                    )}
                  />
                  {errors.isTalebiSaati && <div style={{ color: "red", marginTop: "5px" }}>{errors.isTalebiSaati.message}</div>}
                </div>
              </div>
              <div style={{ width: "100%", maxWidth: "910px" }}>
                <div
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
                      fontWeight: fieldRequirements.aciklama ? "600" : "normal",
                    }}
                  >
                    İş Talebi Açıklaması:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "300px",
                      minWidth: "300px",
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <Controller
                      name="aciklama"
                      disabled
                      control={control}
                      rules={{
                        required: fieldRequirements.aciklama ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field }) => <TextArea {...field} status={errors.aciklama ? "error" : ""} rows={2} style={{ flex: 1 }} />}
                    />
                    {errors.aciklama && <div style={{ color: "red", marginTop: "5px" }}>{errors.aciklama.message}</div>}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "column",
                width: "100%",
                maxWidth: "415px",
              }}
            >
              <div
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "5px",
                  paddingBottom: "5px",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#0062ff",
                  }}
                >
                  Detay Bilgiler
                </Text>
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
                      fontWeight: fieldRequirements.masrafMerkezi ? "600" : "normal",
                    }}
                  >
                    Masraf Merkezi:
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
                      name="masrafMerkezi"
                      control={control}
                      rules={{
                        required: fieldRequirements.masrafMerkezi ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          status={errors.masrafMerkezi ? "error" : ""}
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
                        setValue("masrafMerkezi", selectedData.age);
                        setValue("masrafMerkeziID", selectedData.key);
                      }}
                    />
                    <Button onClick={handleMasrafMerkeziMinusClick}> - </Button>
                    {errors.masrafMerkezi && <div style={{ color: "red", marginTop: "5px" }}>{errors.masrafMerkezi.message}</div>}
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
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: fieldRequirements.proje ? "600" : "normal",
                    }}
                  >
                    Proje:
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
                      name="proje"
                      control={control}
                      rules={{
                        required: fieldRequirements.proje ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          status={errors.proje ? "error" : ""}
                          type="text" // Set the type to "text" for name input
                          style={{ width: "215px" }}
                          disabled
                        />
                      )}
                    />
                    <Controller
                      name="projeID"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text" // Set the type to "text" for name input
                          style={{ display: "none" }}
                        />
                      )}
                    />
                    <ProjeTablo
                      onSubmit={(selectedData) => {
                        setValue("proje", selectedData.subject);
                        setValue("projeID", selectedData.key);
                      }}
                    />
                    <Button onClick={handleProjeMinusClick}> - </Button>
                    {errors.proje && <div style={{ color: "red", marginTop: "5px" }}>{errors.proje.message}</div>}
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
                      fontWeight: fieldRequirements.referansNo ? "600" : "normal",
                    }}
                  >
                    Referans No:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "300px",
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <Controller
                      name="referansNo"
                      control={control}
                      rules={{
                        required: fieldRequirements.referansNo ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field }) => <Input {...field} status={errors.referansNo ? "error" : ""} style={{ flex: 1 }} />}
                    />
                    {errors.referansNo && <div style={{ color: "red", marginTop: "5px" }}>{errors.referansNo.message}</div>}
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
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: fieldRequirements.tamamlanmaOranı ? "600" : "normal",
                    }}
                  >
                    Tamamlanma %:
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
                      name="tamamlanmaOranı"
                      control={control}
                      rules={{
                        required: fieldRequirements.tamamlanmaOranı ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field }) => <InputNumber {...field} min={0} max={100} status={errors.tamamlanmaOranı ? "error" : ""} style={{ width: "60px" }} />}
                    />
                    <Controller name="tamamlanmaOranı" control={control} render={({ field }) => <Slider {...field} style={{ width: "220px" }} />} />
                    {errors.tamamlanmaOranı && <div style={{ color: "red", marginTop: "5px" }}>{errors.tamamlanmaOranı.message}</div>}
                  </div>
                </StyledDivBottomLine>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            width: "100%",
            maxWidth: "480px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "100%",
              maxWidth: "480px",
            }}
          >
            <div
              style={{
                borderBottom: "1px solid #e8e8e8",
                marginBottom: "5px",
                paddingBottom: "5px",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#0062ff",
                }}
              >
                Çalışma Süresi
              </Text>
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
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.planlananBaslama ? "600" : "normal",
                }}
              >
                Planlanan Başlama:
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
                  name="planlananBaslama"
                  control={control}
                  rules={{
                    required: fieldRequirements.planlananBaslama ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      status={errors.planlananBaslama ? "error" : ""}
                      // disabled={!isDisabled}
                      style={{ width: "180px" }}
                      format={localeDateFormat}
                      placeholder="Tarih seçiniz"
                    />
                  )}
                />
                <Controller
                  name="planlananBaslamaSaati"
                  control={control}
                  rules={{
                    required: fieldRequirements.planlananBaslama ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TimePicker
                      {...field}
                      changeOnScroll
                      needConfirm={false}
                      status={errors.planlananBaslama ? "error" : ""}
                      // disabled={!isDisabled}
                      style={{ width: "110px" }}
                      format={localeTimeFormat}
                      placeholder="Saat seçiniz"
                    />
                  )}
                />
                {errors.planlananBaslama && <div style={{ color: "red", marginTop: "5px" }}>{errors.planlananBaslama.message}</div>}
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
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.planlananBitis ? "600" : "normal",
                }}
              >
                Planlanan Bitiş:
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
                  name="planlananBitis"
                  control={control}
                  rules={{
                    required: fieldRequirements.planlananBitis ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      status={errors.planlananBitis ? "error" : ""}
                      // disabled={!isDisabled}
                      style={{ width: "180px" }}
                      format={localeDateFormat}
                      placeholder="Tarih seçiniz"
                    />
                  )}
                />
                <Controller
                  name="planlananBitisSaati"
                  control={control}
                  rules={{
                    required: fieldRequirements.planlananBitis ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TimePicker
                      {...field}
                      changeOnScroll
                      needConfirm={false}
                      status={errors.planlananBitis ? "error" : ""}
                      // disabled={!isDisabled}
                      style={{ width: "110px" }}
                      format={localeTimeFormat}
                      placeholder="Saat seçiniz"
                    />
                  )}
                />
                {errors.planlananBitis && <div style={{ color: "red", marginTop: "5px" }}>{errors.planlananBitis.message}</div>}
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
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.baslamaZamani ? "600" : "normal",
                }}
              >
                Başlama Zamanı:
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
                  name="baslamaZamani"
                  control={control}
                  rules={{
                    required: fieldRequirements.baslamaZamani ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      status={errors.baslamaZamani ? "error" : ""}
                      // disabled={!isDisabled}
                      style={{ width: "180px" }}
                      format={localeDateFormat}
                      placeholder="Tarih seçiniz"
                    />
                  )}
                />
                <Controller
                  name="baslamaZamaniSaati"
                  control={control}
                  rules={{
                    required: fieldRequirements.baslamaZamaniSaati ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TimePicker
                      {...field}
                      changeOnScroll
                      needConfirm={false}
                      status={errors.baslamaZamaniSaati ? "error" : ""}
                      // disabled={!isDisabled}
                      style={{ width: "110px" }}
                      format={localeTimeFormat}
                      placeholder="Saat seçiniz"
                    />
                  )}
                />
                {errors.baslamaZamaniSaati && <div style={{ color: "red", marginTop: "5px" }}>{errors.baslamaZamaniSaati.message}</div>}
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
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.bitisZamani ? "600" : "normal",
                }}
              >
                Bitiş Zamanı:
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
                  name="bitisZamani"
                  control={control}
                  rules={{
                    required: fieldRequirements.bitisZamani ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      status={errors.bitisZamani ? "error" : ""}
                      // disabled={!isDisabled}
                      style={{ width: "180px" }}
                      format={localeDateFormat}
                      placeholder="Tarih seçiniz"
                    />
                  )}
                />
                <Controller
                  name="bitisZamaniSaati"
                  control={control}
                  rules={{
                    required: fieldRequirements.bitisZamaniSaati ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TimePicker
                      {...field}
                      changeOnScroll
                      needConfirm={false}
                      status={errors.bitisZamaniSaati ? "error" : ""}
                      // disabled={!isDisabled}
                      style={{ width: "110px" }}
                      format={localeTimeFormat}
                      placeholder="Saat seçiniz"
                    />
                  )}
                />
                {errors.bitisZamaniSaati && <div style={{ color: "red", marginTop: "5px" }}>{errors.bitisZamaniSaati.message}</div>}
              </div>
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
                  maxWidth: "480px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.calismaSuresi ? "600" : "normal",
                  }}
                >
                  Çalışma Süresi (Saat - dk):
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
                    name="calismaSaat"
                    control={control}
                    rules={{
                      required: fieldRequirements.calismaSuresi ? "Alan Boş Bırakılamaz!" : false,
                    }}
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
                    rules={{
                      required: fieldRequirements.calismaDakika ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field }) => <InputNumber {...field} min={0} max={59} status={errors.calismaDakika ? "error" : ""} style={{ width: "145px" }} />}
                  />
                  {errors.calismaDakika && <div style={{ color: "red", marginTop: "5px" }}>{errors.calismaDakika.message}</div>}
                </div>
              </StyledDivBottomLine>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "100%",
              maxWidth: "480px",
            }}
          >
            <div
              style={{
                borderBottom: "1px solid #e8e8e8",
                marginBottom: "5px",
                paddingBottom: "5px",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#0062ff",
                }}
              >
                Diş Servis
              </Text>
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
                  maxWidth: "480px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.firma ? "600" : "normal",
                  }}
                >
                  Firma:
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
                    name="firma"
                    control={control}
                    rules={{
                      required: fieldRequirements.firma ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        status={errors.firma ? "error" : ""}
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
                      setValue("firma", selectedData.subject);
                      setValue("firmaID", selectedData.key);
                    }}
                  />
                  <Button onClick={handleFirmaMinusClick}> - </Button>
                  {errors.firma && <div style={{ color: "red", marginTop: "5px" }}>{errors.firma.message}</div>}
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
                  maxWidth: "480px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.sozlesme ? "600" : "normal",
                  }}
                >
                  Sözleşme:
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
                    name="sozlesme"
                    control={control}
                    rules={{
                      required: fieldRequirements.sozlesme ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        status={errors.sozlesme ? "error" : ""}
                        type="text" // Set the type to "text" for name input
                        style={{ width: "215px" }}
                        disabled
                      />
                    )}
                  />
                  <Controller
                    name="sozlesmeID"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ display: "none" }}
                      />
                    )}
                  />
                  <SozlesmeTablo
                    onSubmit={(selectedData) => {
                      setValue("sozlesme", selectedData.CAS_TANIM);
                      setValue("sozlesmeID", selectedData.key);
                    }}
                  />
                  <Button onClick={handleSozlesmeMinusClick}> - </Button>
                  {errors.sozlesme && <div style={{ color: "red", marginTop: "5px" }}>{errors.sozlesme.message}</div>}
                </div>
              </StyledDivBottomLine>
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
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.evrakNo ? "600" : "normal",
                }}
              >
                Evrak No/Tarihi:
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
                  name="evrakNo"
                  control={control}
                  rules={{
                    required: fieldRequirements.evrakNo ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={0}
                      // max={59}
                      status={errors.evrakNo ? "error" : ""}
                      style={{ width: "145px" }}
                    />
                  )}
                />
                <Controller
                  name="evrakTarihi"
                  control={control}
                  rules={{
                    required: fieldRequirements.evrakTarihi ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      status={errors.evrakTarihi ? "error" : ""}
                      // disabled={!isDisabled}
                      style={{ width: "145px" }}
                      format={localeDateFormat}
                      placeholder="Tarih seçiniz"
                    />
                  )}
                />
                {errors.evrakTarihi && <div style={{ color: "red", marginTop: "5px" }}>{errors.evrakTarihi.message}</div>}
              </div>
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
                  maxWidth: "480px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.maliyet ? "600" : "normal",
                  }}
                >
                  Maliyet:
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "300px",
                    gap: "10px",
                  }}
                >
                  <Controller
                    name="maliyet"
                    control={control}
                    rules={{
                      required: fieldRequirements.maliyet ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        // max={24}
                        status={errors.maliyet ? "error" : ""}
                        style={{ width: "125px" }}
                      />
                    )}
                  />
                  <div>
                    <Controller
                      name="garantiKapsami"
                      control={control}
                      render={({ field }) => (
                        <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                          Garanti Kapsamında
                        </Checkbox>
                      )}
                    />
                  </div>
                  {errors.maliyet && <div style={{ color: "red", marginTop: "5px" }}>{errors.maliyet.message}</div>}
                </div>
              </StyledDivBottomLine>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
