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
                <Text style={{ fontSize: "14px" }}>Kayıtlı Olduğı İl:</Text>
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
                    name="kayitliOlduguIl"
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
                <Text style={{ fontSize: "14px" }}>Kayıtlı Olduğu İlçe:</Text>
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
                    name="kayitliOlduguIlce"
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
                <Text style={{ fontSize: "14px" }}>Mahalle / Köy:</Text>
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
                    name="mahalleKoy"
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
                <Text style={{ fontSize: "14px" }}>Cilt No:</Text>
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
                    name="ciltNo"
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
                <Text style={{ fontSize: "14px" }}>Aile Sıra No:</Text>
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
                    name="aileSiraNo"
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
                <Text style={{ fontSize: "14px" }}>Sıra No:</Text>
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
                    name="siraNo"
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
                <Text style={{ fontSize: "14px" }}>Verildiği Yer:</Text>
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
                    name="verildigiYer"
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
                <Text style={{ fontSize: "14px" }}>Veriliş Nedeni:</Text>
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
                    name="verilisNedeni"
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
                <Text style={{ fontSize: "14px" }}>Veriliş Tarihi:</Text>
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
                    name="verilisTarihi"
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
        </div>
      </div>
    </div>
  );
}
