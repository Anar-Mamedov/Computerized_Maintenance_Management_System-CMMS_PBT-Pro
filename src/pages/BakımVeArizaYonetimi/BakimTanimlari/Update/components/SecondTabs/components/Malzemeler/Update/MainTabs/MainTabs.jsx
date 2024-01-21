import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import MalzemeTablo from "./components/MalzemeTablo";
import MalzemeTipi from "./components/MalzemeTipi";
import MiktarBirim from "./components/MiktarBirim";

const { Text, Link } = Typography;
const { TextArea } = Input;

const onChange = (key) => {
  // console.log(key);
};

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  const handleMalzemeMinusClick = () => {
    setValue("malzemeKoduTanim", "");
    setValue("malzemeKoduID", "");
    setValue("malzemeTanimi", "");
    setValue("malzemeTipi", null);
    setValue("malzemeTipiID", "");
    setValue("mazemeFiyati", "");
    setValue("miktarBirim", null);
    setValue("miktarBirimID", "");
  };

  const mazemeMiktari = watch("mazemeMiktari");
  const mazemeFiyati = watch("mazemeFiyati");

  useEffect(() => {
    // mazemeMiktari ve mazemeFiyati'nin sayısal değerler olduğundan emin olun
    const miktari = parseFloat(mazemeMiktari) || 1;
    const fiyati = parseFloat(mazemeFiyati) || 0;

    // Maliyeti hesaplayın
    const mazemeMaliyeti = miktari * fiyati;

    // Hesaplanan maliyeti bir form alanına ayarlayın
    setValue("mazemeMaliyeti", mazemeMaliyeti);
  }, [mazemeMiktari, mazemeFiyati, setValue]);

  return (
    <div>
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
          }}>
          <Text style={{ fontSize: "14px" }}>Malzeme Kodu:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="malzemeKoduTanim"
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
              name="malzemeKoduID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <MalzemeTablo
              onSubmit={(selectedData) => {
                setValue("malzemeKoduTanim", selectedData.code);
                setValue("malzemeKoduID", selectedData.key);
                setValue("malzemeTanimi", selectedData.subject);
                setValue("malzemeTipi", selectedData.workdays);
                setValue("malzemeTipiID", selectedData.workdaysID);
                setValue("mazemeFiyati", selectedData.unitPrice);
                setValue("miktarBirim", selectedData.description);
                setValue("miktarBirimID", selectedData.descriptionID);
              }}
            />
            <Button onClick={handleMalzemeMinusClick}> - </Button>
          </div>
        </StyledDivBottomLine>
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
          marginBottom: "10px",
        }}>
        <Text style={{ fontSize: "14px" }}>Malzeme Tanımı:</Text>
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
            name="malzemeTanimi"
            control={control}
            render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
          />
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <MalzemeTipi />
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Miktar:</Text>
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
              name="mazemeMiktari"
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
            <MiktarBirim />
          </div>
        </StyledDivBottomLine>
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Fiyat:</Text>
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
              name="mazemeFiyati"
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
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Maliyet:</Text>
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
              name="mazemeMaliyeti"
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
      </div>
    </div>
  );
}
