import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import ProsedurTablo from "./components/ProsedurTablo";
import ProsedurTipi from "./components/ProsedurTipi";
import ProsedurNedeni from "./components/ProsedurNedeni";
import OncelikTablo from "./components/OncelikTablo";
import AtolyeTablo from "./components/AtolyeTablo";
import TalimatTablo from "./components/TalimatTablo";
import TakvimTablo from "./components/TakvimTablo";

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
        <div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "100%", maxWidth: "850px" }}>
          <div>
            <div
              style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "15px", paddingBottom: "5px", width: "100%" }}>
              <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>İş Bilgileri</Text>
            </div>
            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
              <div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "100%", maxWidth: "450px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <StyledDivBottomLine
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      width: "100%",
                      maxWidth: "450px",
                    }}>
                    <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.prosedur ? "600" : "normal" }}>
                      Prosedür:
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
                        name="prosedur"
                        control={control}
                        rules={{ required: fieldRequirements.prosedur ? "Alan Boş Bırakılamaz!" : false }}
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
                      {errors.prosedur && (
                        <div style={{ color: "red", marginTop: "5px" }}>{errors.prosedur.message}</div>
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
                    }}>
                    <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.konu ? "600" : "normal" }}>
                      Konu:
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        maxWidth: "300px",
                        width: "100%",
                        flexDirection: "column",
                      }}>
                      <Controller
                        name="konu"
                        control={control}
                        rules={{ required: fieldRequirements.konu ? "Alan Boş Bırakılamaz!" : false }}
                        render={({ field }) => (
                          <Input {...field} status={errors.konu ? "error" : ""} style={{ flex: 1 }} />
                        )}
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
                    }}>
                    <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.prosedurTipi ? "600" : "normal" }}>
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
                    }}>
                    <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.prosedurNedeni ? "600" : "normal" }}>
                      Nedeni:
                    </Text>
                    <ProsedurNedeni fieldRequirements={fieldRequirements} />
                  </StyledDivBottomLine>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "100%", maxWidth: "390px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <StyledDivBottomLine
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      width: "100%",
                      maxWidth: "450px",
                    }}>
                    <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.oncelikTanim ? "600" : "normal" }}>
                      Öncelik:
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
                        name="oncelikTanim"
                        control={control}
                        rules={{ required: fieldRequirements.oncelikTanim ? "Alan Boş Bırakılamaz!" : false }}
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
                        <div style={{ color: "red", marginTop: "5px" }}>{errors.oncelikTanim.message}</div>
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
                    <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.atolyeTanim ? "600" : "normal" }}>
                      Atölye:
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
                        name="atolyeTanim"
                        control={control}
                        rules={{ required: fieldRequirements.atolyeTanim ? "Alan Boş Bırakılamaz!" : false }}
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
                      {errors.atolyeTanim && (
                        <div style={{ color: "red", marginTop: "5px" }}>{errors.atolyeTanim.message}</div>
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
                    <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.takvimTanim ? "600" : "normal" }}>
                      Takvim:
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
                        name="takvimTanim"
                        control={control}
                        rules={{ required: fieldRequirements.takvimTanim ? "Alan Boş Bırakılamaz!" : false }}
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
                      {errors.takvimTanim && (
                        <div style={{ color: "red", marginTop: "5px" }}>{errors.takvimTanim.message}</div>
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
                    <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.talimatTanim ? "600" : "normal" }}>
                      Talimat:
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
                        name="talimatTanim"
                        control={control}
                        rules={{ required: fieldRequirements.talimatTanim ? "Alan Boş Bırakılamaz!" : false }}
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
                      {errors.talimatTanim && (
                        <div style={{ color: "red", marginTop: "5px" }}>{errors.talimatTanim.message}</div>
                      )}
                    </div>
                  </StyledDivBottomLine>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "100%", maxWidth: "450px" }}>
              <div
                style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
                <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>İş Talebi</Text>
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
                  <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.isTalebiKodu ? "600" : "normal" }}>
                    İş Talebi Kodu:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "300px",
                      width: "100%",
                      flexDirection: "column",
                    }}>
                    <Controller
                      name="isTalebiKodu"
                      control={control}
                      rules={{ required: fieldRequirements.isTalebiKodu ? "Alan Boş Bırakılamaz!" : false }}
                      render={({ field }) => (
                        <Input {...field} disabled status={errors.isTalebiKodu ? "error" : ""} style={{ flex: 1 }} />
                      )}
                    />
                    {errors.isTalebiKodu && (
                      <div style={{ color: "red", marginTop: "5px" }}>{errors.isTalebiKodu.message}</div>
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
                  }}>
                  <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.talepEden ? "600" : "normal" }}>
                    Talep Eden:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "300px",
                      width: "100%",
                      flexDirection: "column",
                    }}>
                    <Controller
                      name="talepEden"
                      control={control}
                      rules={{ required: fieldRequirements.talepEden ? "Alan Boş Bırakılamaz!" : false }}
                      render={({ field }) => (
                        <Input {...field} disabled status={errors.talepEden ? "error" : ""} style={{ flex: 1 }} />
                      )}
                    />
                    {errors.talepEden && (
                      <div style={{ color: "red", marginTop: "5px" }}>{errors.talepEden.message}</div>
                    )}
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
                }}>
                <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.isTalebiTarihi ? "600" : "normal" }}>
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
                  }}>
                  <Controller
                    name="isTalebiTarihi"
                    control={control}
                    rules={{ required: fieldRequirements.isTalebiTarihi ? "Alan Boş Bırakılamaz!" : false }}
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
                    rules={{ required: fieldRequirements.isTalebiSaati ? "Alan Boş Bırakılamaz!" : false }}
                    render={({ field, fieldState: { error } }) => (
                      <TimePicker
                        {...field}
                        status={errors.isTalebiSaati ? "error" : ""}
                        // disabled={!isDisabled}
                        disabled
                        style={{ width: "110px" }}
                        format={localeTimeFormat}
                        placeholder="Saat seçiniz"
                      />
                    )}
                  />
                  {errors.isTalebiSaati && (
                    <div style={{ color: "red", marginTop: "5px" }}>{errors.isTalebiSaati.message}</div>
                  )}
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
                  }}>
                  <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.aciklama ? "600" : "normal" }}>
                    Açıklama:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "300px",
                      minWidth: "300px",
                      width: "100%",
                      flexDirection: "column",
                    }}>
                    <Controller
                      name="aciklama"
                      control={control}
                      rules={{ required: fieldRequirements.aciklama ? "Alan Boş Bırakılamaz!" : false }}
                      render={({ field }) => (
                        <TextArea {...field} status={errors.aciklama ? "error" : ""} rows={2} style={{ flex: 1 }} />
                      )}
                    />
                    {errors.aciklama && <div style={{ color: "red", marginTop: "5px" }}>{errors.aciklama.message}</div>}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "100%", maxWidth: "390px" }}>
              <div
                style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
                <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Detay Bilgiler</Text>
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
                  <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.referansNo ? "600" : "normal" }}>
                    Referans No:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "300px",
                      width: "100%",
                      flexDirection: "column",
                    }}>
                    <Controller
                      name="referansNo"
                      control={control}
                      rules={{ required: fieldRequirements.referansNo ? "Alan Boş Bırakılamaz!" : false }}
                      render={({ field }) => (
                        <Input {...field} status={errors.referansNo ? "error" : ""} style={{ flex: 1 }} />
                      )}
                    />
                    {errors.referansNo && (
                      <div style={{ color: "red", marginTop: "5px" }}>{errors.referansNo.message}</div>
                    )}
                  </div>
                </StyledDivBottomLine>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
