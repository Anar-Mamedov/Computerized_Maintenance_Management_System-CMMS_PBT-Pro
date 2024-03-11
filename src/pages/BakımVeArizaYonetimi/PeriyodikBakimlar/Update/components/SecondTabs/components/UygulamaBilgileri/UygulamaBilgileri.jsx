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

export default function UygulamaBilgileri() {
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
        <div style={{ width: "100%", maxWidth: "450px", borderBottom: "1px solid #004fff", marginBottom: "15px" }}>
          <Text style={{ fontSize: "14px", color: "#004fff" }}>İş Emri Bilgileri</Text>
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
            <Text style={{ fontSize: "14px" }}>Son Uygulanan Tarih:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "250px",
                minWidth: "250px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="sonUygulananTarihi"
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
            <Text style={{ fontSize: "14px" }}>Son Uygulanan İş Emri No:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "250px",
                minWidth: "250px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="sonUygulananIsEmriNo"
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
            <Text style={{ fontSize: "14px" }}>Toplam İş Emri Sayısı:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "250px",
                minWidth: "250px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="toplamIsEmriSayisi"
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
      <div style={{ width: "100%", maxWidth: "450px" }}>
        <div style={{ width: "100%", maxWidth: "450px", borderBottom: "1px solid #004fff", marginBottom: "15px" }}>
          <Text style={{ fontSize: "14px", color: "#004fff" }}>Uygulama Bilgileri</Text>
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
            <Text style={{ fontSize: "14px" }}>Uygulama Sıklığı (Gün):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "250px",
                minWidth: "250px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="uygulamaSikligi"
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
            <Text style={{ fontSize: "14px" }}>Ortalama Bakım Süresi (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "250px",
                minWidth: "250px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="ortalamaBakimSuresi"
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
            <Text style={{ fontSize: "14px" }}>Ortalama Duruş Süresi (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "250px",
                minWidth: "250px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="ortalamaDurusSuresi"
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
      <div style={{ width: "100%", maxWidth: "450px" }}>
        <div style={{ width: "100%", maxWidth: "450px", borderBottom: "1px solid #004fff", marginBottom: "15px" }}>
          <Text style={{ fontSize: "14px", color: "#004fff" }}>Maliyet Bilgileri</Text>
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
            <Text style={{ fontSize: "14px" }}>Ortalama Malzeme Maliyeti:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "250px",
                minWidth: "250px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="ortalamaMalzemeMaliyeti"
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
            <Text style={{ fontSize: "14px" }}>Ortalama İşçilik Maliyeti:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "250px",
                minWidth: "250px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="ortalamaIscilikMaliyeti"
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
            <Text style={{ fontSize: "14px" }}>Ortalama Dış Servis Maliyeti:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "250px",
                minWidth: "250px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="ortalamaDisServisMaliyeti"
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
