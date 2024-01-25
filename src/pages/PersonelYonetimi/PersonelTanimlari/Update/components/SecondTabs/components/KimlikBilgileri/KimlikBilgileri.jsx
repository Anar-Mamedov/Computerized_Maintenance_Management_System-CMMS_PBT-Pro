import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import MedeniHali from "./components/MedeniHali";

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

export default function KimlikBilgileri() {
  const { control, watch, setValue } = useFormContext();

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
        <div style={{ display: "flex", maxWidth: "910px", width: "100%", gap: "10px" }}>
          <div style={{ maxWidth: "450px", width: "100%" }}>
            <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>T.C. Kimlik No:</Text>
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
                    name="tcKimlikNo"
                    control={control}
                    render={({ field }) => <Input {...field} type="number" style={{ flex: 1 }} />}
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
                <Text style={{ fontSize: "14px" }}>Seri No:</Text>
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
                    name="seriNo"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
                <Text style={{ fontSize: "14px" }}>Baba Adı:</Text>
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
                    name="babaAdi"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
                <Text style={{ fontSize: "14px" }}>Ana Adı:</Text>
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
                    name="anaAdi"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
                <Text style={{ fontSize: "14px" }}>Doğum Yeri:</Text>
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
                    name="dogumYeri"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
                <Text style={{ fontSize: "14px" }}>Dini:</Text>
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
                    name="dini"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
                <Text style={{ fontSize: "14px" }}>Kayıt No:</Text>
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
                    name="kayitNo"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
                <Text style={{ fontSize: "14px" }}>Mezuniyet Tarihi:</Text>
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
                    name="mezuniyetTarihi"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        style={{ width: "200px" }}
                        format="DD-MM-YYYY"
                        placeholder="Tarih seçiniz"
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
                <Text style={{ fontSize: "14px" }}>Medeni Hali:</Text>
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
                  <MedeniHali />
                </div>
              </StyledDivBottomLine>
            </div>
          </div>
          <div style={{ maxWidth: "450px", width: "100%" }}>
            <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>İşe Başlama Tarihi:</Text>
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
                    name="iseBaslamaTarihi"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        style={{ width: "200px" }}
                        format="DD-MM-YYYY"
                        placeholder="Tarih seçiniz"
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
                <Text style={{ fontSize: "14px" }}>İşten Ayrılma Tarihi:</Text>
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
                    name="istenAyrilmaTarihi"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        style={{ width: "200px" }}
                        format="DD-MM-YYYY"
                        placeholder="Tarih seçiniz"
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
                <Text style={{ fontSize: "14px" }}>İşçilik Ücreti:</Text>
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
                    name="iscilikUcreti"
                    control={control}
                    render={({ field }) => <Input {...field} type="number" style={{ flex: 1 }} />}
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
                <Text style={{ fontSize: "14px" }}>Fazla Mesai Ücreti:</Text>
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
                    name="fazlaMesaiUcreti"
                    control={control}
                    render={({ field }) => <Input {...field} type="number" style={{ flex: 1 }} />}
                  />
                </div>
              </StyledDivBottomLine>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
