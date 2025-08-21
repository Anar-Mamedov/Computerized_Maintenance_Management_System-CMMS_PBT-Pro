import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import Ehliyet from "./components/Ehliyet";

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

export default function EhliyetBilgileri() {
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
        <div style={{ display: "flex", maxWidth: "940px", width: "100%", gap: "10px" }}>
          <div style={{ maxWidth: "480px", width: "100%" }}>
            <div style={{ width: "100%", maxWidth: "480px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>Ehliyet:</Text>
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
                  <Ehliyet />
                </div>
              </StyledDivBottomLine>
            </div>
            <div style={{ width: "100%", maxWidth: "480px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>Sınıfı:</Text>
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
                    name="sinifi"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
                  />
                </div>
              </StyledDivBottomLine>
            </div>
            <div style={{ width: "100%", maxWidth: "480px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>Verildiği İl / İlçe:</Text>
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
                    name="ehliyetVerildigiIlIlce"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
                  />
                </div>
              </StyledDivBottomLine>
            </div>
            <div style={{ width: "100%", maxWidth: "480px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>Belge No:</Text>
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
                    name="belgeNo"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
                  />
                </div>
              </StyledDivBottomLine>
            </div>
            <div style={{ width: "100%", maxWidth: "480px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>Belge Tarihi:</Text>
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
                    name="belgeTarihi"
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
            <div style={{ width: "100%", maxWidth: "480px", marginBottom: "10px" }}>
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
                    name="ehliyetSeriNo"
                    control={control}
                    render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
                  />
                </div>
              </StyledDivBottomLine>
            </div>
            <div style={{ width: "100%", maxWidth: "480px", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <Text style={{ fontSize: "14px" }}>Kullandığı Cihaz / Protezler:</Text>
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
                    name="kullandigiCihazProtezler"
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
                <Text style={{ fontSize: "14px" }}>Ceza Puanı:</Text>
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
                    name="cezaPuani"
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
