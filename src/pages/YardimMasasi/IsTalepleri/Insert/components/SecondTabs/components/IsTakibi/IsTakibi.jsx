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

export default function IsTakibi({ fieldRequirements }) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

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
        <div style={{ width: "100%", maxWidth: "910px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.konu ? "600" : "normal" }}>Konu:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                maxWidth: "760px",
                minWidth: "300px",
                width: "100%",
                flexDirection: "column",
              }}>
              <Controller
                name="konu"
                control={control}
                rules={{ required: fieldRequirements.konu ? "Alan Boş Bırakılamaz!" : false }}
                render={({ field }) => <Input {...field} status={errors.konu ? "error" : ""} style={{ flex: 1 }} />}
              />
              {errors.konu && <div style={{ color: "red", marginTop: "5px" }}>{errors.konu.message}</div>}
            </div>
          </StyledDivBottomLine>
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
                maxWidth: "760px",
                minWidth: "300px",
                width: "100%",
                flexDirection: "column",
              }}>
              <Controller
                name="aciklama"
                control={control}
                rules={{ required: fieldRequirements.aciklama ? "Alan Boş Bırakılamaz!" : false }}
                render={({ field }) => (
                  <TextArea {...field} status={errors.aciklama ? "error" : ""} rows={4} style={{ flex: 1 }} />
                )}
              />
              {errors.aciklama && <div style={{ color: "red", marginTop: "5px" }}>{errors.aciklama.message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
