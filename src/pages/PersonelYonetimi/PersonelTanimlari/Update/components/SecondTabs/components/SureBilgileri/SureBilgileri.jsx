import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

const { Text, Link } = Typography;
const { TextArea } = Input;

const onChange = (key) => {
  // console.log(key);
};

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function SureBilgileri() {
  const { control, watch, setValue } = useFormContext();

  const lojistikSuresi = watch("lojistikSuresi");
  const seyahetSuresi = watch("seyahetSuresi");
  const onaySuresi = watch("onaySuresi");
  const beklemeSuresi = watch("beklemeSuresi");
  const digerSuresi = watch("digerSuresi");
  const calismaSuresi = watch("calismaSuresi");

  // Geçersiz değerleri sıfıra dönüştüren yardımcı fonksiyon
  const getValidValue = (value) => value ?? 0;

  useEffect(() => {
    // Toplam müdahale süresini hesaplama
    const toplamMudaheleSuresi = [lojistikSuresi, seyahetSuresi, onaySuresi, beklemeSuresi, digerSuresi].reduce( (total, current) => total + getValidValue(current), 0 );

    setValue("mudahaleSuresi", toplamMudaheleSuresi);

    // Toplam iş süresini hesaplama
    const toplamIsSuresi = toplamMudaheleSuresi + getValidValue(calismaSuresi);
    setValue("toplamIsSuresi", toplamIsSuresi);
  }, [lojistikSuresi, seyahetSuresi, onaySuresi, beklemeSuresi, digerSuresi, calismaSuresi, setValue]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "40px", gap: "20px" }}>
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
      <div>
        <div style={{ width: "100%", maxWidth: "450px", borderBottom: "1px solid #004fff", marginBottom: "15px" }}>
          <Text style={{ fontSize: "14px", color: "#004fff" }}>Müdahele Süresi</Text>
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
            <Text style={{ fontSize: "14px" }}>Lojistik Süresi (dk.):</Text>
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
                name="lojistikSuresi"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10);
                      if (value < 0) {
                        // Negatif değer girilirse, sıfıra ayarla
                        value = 0;
                        field.onChange(value);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    onKeyPress={(e) => {
                      // Eksi (-) ve artı (+) işaretlerini girilmesini önle
                      if (e.key === "-" || e.key === "+") {
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
            <Text style={{ fontSize: "14px" }}>Seyahet Süresi (dk):</Text>
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
                name="seyahetSuresi"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10);
                      if (value < 0) {
                        // Negatif değer girilirse, sıfıra ayarla
                        value = 0;
                        field.onChange(value);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    onKeyPress={(e) => {
                      // Eksi (-) ve artı (+) işaretlerini girilmesini önle
                      if (e.key === "-" || e.key === "+") {
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
            <Text style={{ fontSize: "14px" }}>Onay Süresi (dk.):</Text>
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
                name="onaySuresi"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10);
                      if (value < 0) {
                        // Negatif değer girilirse, sıfıra ayarla
                        value = 0;
                        field.onChange(value);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    onKeyPress={(e) => {
                      // Eksi (-) ve artı (+) işaretlerini girilmesini önle
                      if (e.key === "-" || e.key === "+") {
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
            <Text style={{ fontSize: "14px" }}>Bekleme Süresi (dk.):</Text>
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
                name="beklemeSuresi"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10);
                      if (value < 0) {
                        // Negatif değer girilirse, sıfıra ayarla
                        value = 0;
                        field.onChange(value);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    onKeyPress={(e) => {
                      // Eksi (-) ve artı (+) işaretlerini girilmesini önle
                      if (e.key === "-" || e.key === "+") {
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
            <Text style={{ fontSize: "14px" }}>Diğer (dk.):</Text>
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
                name="digerSuresi"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10);
                      if (value < 0) {
                        // Negatif değer girilirse, sıfıra ayarla
                        value = 0;
                        field.onChange(value);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    onKeyPress={(e) => {
                      // Eksi (-) ve artı (+) işaretlerini girilmesini önle
                      if (e.key === "-" || e.key === "+") {
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
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ width: "100%", maxWidth: "450px", borderBottom: "1px solid #004fff", marginBottom: "15px" }}>
            <Text style={{ fontSize: "14px", color: "#004fff" }}>Toplam İş Süresi</Text>
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
              <Text style={{ fontSize: "14px" }}>Müdahele Süresi (dk.):</Text>
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
                  name="mudahaleSuresi"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      disabled
                      style={{ flex: 1 }}
                      onChange={(e) => {
                        let value = parseInt(e.target.value, 10);
                        if (value < 0) {
                          // Negatif değer girilirse, sıfıra ayarla
                          value = 0;
                          field.onChange(value);
                        } else {
                          field.onChange(value);
                        }
                      }}
                      onKeyPress={(e) => {
                        // Eksi (-) ve artı (+) işaretlerini girilmesini önle
                        if (e.key === "-" || e.key === "+") {
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
              <Text style={{ fontSize: "14px" }}>Çalışma Süresi (dk):</Text>
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
                  name="calismaSuresi"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      style={{ flex: 1 }}
                      onChange={(e) => {
                        let value = parseInt(e.target.value, 10);
                        if (value < 0) {
                          // Negatif değer girilirse, sıfıra ayarla
                          value = 0;
                          field.onChange(value);
                        } else {
                          field.onChange(value);
                        }
                      }}
                      onKeyPress={(e) => {
                        // Eksi (-) ve artı (+) işaretlerini girilmesini önle
                        if (e.key === "-" || e.key === "+") {
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
        <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Toplam İş Süresi:</Text>
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
                name="toplamIsSuresi"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    disabled
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10);
                      if (value < 0) {
                        // Negatif değer girilirse, sıfıra ayarla
                        value = 0;
                        field.onChange(value);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    onKeyPress={(e) => {
                      // Eksi (-) ve artı (+) işaretlerini girilmesini önle
                      if (e.key === "-" || e.key === "+") {
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
    </div>
  );
}
