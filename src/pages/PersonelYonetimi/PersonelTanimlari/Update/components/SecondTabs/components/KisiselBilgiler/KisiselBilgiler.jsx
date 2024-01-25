import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

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
                <Text style={{ fontSize: "14px" }}>Şehir:</Text>
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
                    name="sehir"
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
                <Text style={{ fontSize: "14px" }}>Posta Kodu:</Text>
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
                    name="postaKodu"
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
                <Text style={{ fontSize: "14px" }}>Telefon #1:</Text>
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
                    name="telefon1"
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
                <Text style={{ fontSize: "14px" }}>Telefon #2:</Text>
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
                    name="telefon2"
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
                <Text style={{ fontSize: "14px" }}>Dahili:</Text>
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
                    name="dahili"
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
                <Text style={{ fontSize: "14px" }}>E-Mail:</Text>
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
                    name="email"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
                <Text style={{ fontSize: "14px" }}>İlçe:</Text>
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
                    name="ilce"
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
                <Text style={{ fontSize: "14px" }}>Ülke:</Text>
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
                    name="ulke"
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
                <Text style={{ fontSize: "14px" }}>Fax:</Text>
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
                    name="fax"
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
                <Text style={{ fontSize: "14px" }}>GSM:</Text>
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
                    name="gsm"
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
