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

export default function Maliyetler() {
  const { control, watch, setValue } = useFormContext();
  const malzeme = watch("maliyetlerMalzeme");
  const iscilik = watch("maliyetlerIscilik");
  const genelGider = watch("maliyetlerGenelGider");

  const calculateTotal = () => {
    // Replace commas with dots and parse to float
    const parseValue = (value) => parseFloat((value || "0").replace(",", "."));

    const total = parseValue(malzeme) + parseValue(iscilik) + parseValue(genelGider);
    setValue("maliyetlerToplam", total.toString().replace(".", ",")); // Convert to string and replace dot with comma
  };

  useEffect(() => {
    calculateTotal();
  }, [malzeme, iscilik, genelGider]);

  return (
    <div style={{ paddingBottom: "25px" }}>
      <div style={{ width: "100%", maxWidth: "450px", borderBottom: "1px solid #004fff", marginBottom: "15px" }}>
        <Text style={{ fontSize: "14px", color: "#004fff" }}>Maliyetler</Text>
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
          <Text style={{ fontSize: "14px" }}>Malzeme:</Text>
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
              name="maliyetlerMalzeme"
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
          <Text style={{ fontSize: "14px" }}>İşçilik:</Text>
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
              name="maliyetlerIscilik"
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
          <Text style={{ fontSize: "14px" }}>Genel Gider:</Text>
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
              name="maliyetlerGenelGider"
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
          <Text style={{ fontSize: "14px" }}>Toplam:</Text>
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
              name="maliyetlerToplam"
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
