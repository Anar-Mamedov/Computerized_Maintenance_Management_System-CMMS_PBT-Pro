import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import UcretTipi from "./components/UcretTipi";
import Dili from "./components/Dili";
import Uyruk from "./components/Uyruk";
import Cinsiyet from "./components/Cinsiyet";

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

export default function KisiselBilgiler() {
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
                <Text style={{ fontSize: "14px" }}>Dili:</Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    maxWidth: "300px",
                    gap: "10px",
                    width: "100%",
                  }}>
                  <Dili />
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
                <Text style={{ fontSize: "14px" }}>Uyruğu:</Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    maxWidth: "300px",
                    gap: "10px",
                    width: "100%",
                  }}>
                  <Uyruk />
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
                <Text style={{ fontSize: "14px" }}>Cinsiyet:</Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    maxWidth: "300px",
                    gap: "10px",
                    width: "100%",
                  }}>
                  <Cinsiyet />
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
                <Text style={{ fontSize: "14px" }}>Kan Grubu:</Text>
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
                    name="kanGrubu"
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
                <Text style={{ fontSize: "14px" }}>SGK No:</Text>
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
                    name="sgkNo"
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
                <Text style={{ fontSize: "14px" }}>Vergi No:</Text>
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
                    name="vergiNo"
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
                <Text style={{ fontSize: "14px" }}>Eğitim Durumu:</Text>
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
                    name="egitimDurumu"
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
                <Text style={{ fontSize: "14px" }}>Mezun Olduğu Okul:</Text>
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
                    name="mezunOkul"
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
                <Text style={{ fontSize: "14px" }}>Mezun Olduğu Bölüm:</Text>
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
                    name="mezunBolum"
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
                <Text style={{ fontSize: "14px" }}>Ücret Tipi:</Text>
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
                  <UcretTipi />
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
