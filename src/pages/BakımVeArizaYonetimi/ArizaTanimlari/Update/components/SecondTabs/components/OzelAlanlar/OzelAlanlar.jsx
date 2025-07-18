import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import OzelAlan6 from "./components/OzelAlan6";
import OzelAlan7 from "./components/OzelAlan7";
import OzelAlan8 from "./components/OzelAlan8";

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
export default function OzelAlanlar() {
  const { control, watch, setValue } = useFormContext();

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
      <div style={{ width: "100%", maxWidth: "450px" }}>
        <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Özel Alan 1:</Text>
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
                name="ozelAlan1"
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
            <Text style={{ fontSize: "14px" }}>Özel Alan 2:</Text>
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
                name="ozelAlan2"
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
            <Text style={{ fontSize: "14px" }}>Özel Alan 3:</Text>
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
                name="ozelAlan3"
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
            <Text style={{ fontSize: "14px" }}>Özel Alan 4:</Text>
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
                name="ozelAlan4"
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
            <Text style={{ fontSize: "14px" }}>Özel Alan 5:</Text>
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
                name="ozelAlan5"
                control={control}
                render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
              />
            </div>
          </StyledDivBottomLine>
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: "450px" }}>
        <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Özel Alan 6:</Text>
            <OzelAlan6 />
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
            <Text style={{ fontSize: "14px" }}>Özel Alan 7:</Text>
            <OzelAlan7 />
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
            <Text style={{ fontSize: "14px" }}>Özel Alan 8:</Text>
            <OzelAlan8 />
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
            <Text style={{ fontSize: "14px" }}>Özel Alan 9:</Text>
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
                name="ozelAlan9"
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
            <Text style={{ fontSize: "14px" }}>Özel Alan 10:</Text>
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
                name="ozelAlan10"
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
    </div>
  );
}
