import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import MakineDurumu from "./components/MakineDurumu";
import EkipmanTablo from "./components/EkipmanTablo";
import MakineTablo from "./components/MakineTablo";

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

export default function MakineVeEkipman({ fieldRequirements }) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleEkipmanMinusClick = () => {
    setValue("ekipman", "");
    setValue("ekipmanID", "");
    setValue("ekipmanTanim", "");
  };

  const handleMakineMinusClick = () => {
    setValue("makine", "");
    setValue("makineID", "");
    setValue("makineTanim", "");
    setValue("ekipman", "");
    setValue("ekipmanID", "");
    setValue("ekipmanTanim", "");
  };

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
        <div style={{ display: "flex", width: "100%", gap: "10px" }}>
          <div style={{ maxWidth: "675px", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: "675px",
                }}>
                <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.makine ? "600" : "normal" }}>
                  Makine Kodu:
                </Text>
                <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "300px",
                      }}>
                      <Controller
                        name="makine"
                        control={control}
                        rules={{ required: fieldRequirements.makine ? "Alan Boş Bırakılamaz!" : false }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            status={errors.makine ? "error" : ""}
                            type="text" // Set the type to "text" for name input
                            style={{ width: "215px" }}
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name="makineID"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text" // Set the type to "text" for name input
                            style={{ display: "none" }}
                          />
                        )}
                      />
                      <MakineTablo
                        onSubmit={(selectedData) => {
                          setValue("makine", selectedData.MKN_KOD);
                          setValue("makineID", selectedData.key);
                          setValue("makineTanim", selectedData.MKN_TANIM);
                        }}
                      />
                      <Button onClick={handleMakineMinusClick}> - </Button>
                    </div>
                    <Controller
                      name="makineTanim"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text" // Set the type to "text" for name input
                          style={{ width: "215px" }}
                          disabled
                        />
                      )}
                    />
                  </div>
                  {errors.makine && <div style={{ color: "red", marginTop: "5px" }}>{errors.makine.message}</div>}
                </div>
              </StyledDivBottomLine>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
              <StyledDivBottomLine
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: "675px",
                }}>
                <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.ekipman ? "600" : "normal" }}>
                  Ekipman Kodu:
                </Text>
                <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "300px",
                      }}>
                      <Controller
                        name="ekipman"
                        control={control}
                        rules={{ required: fieldRequirements.ekipman ? "Alan Boş Bırakılamaz!" : false }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            status={errors.ekipman ? "error" : ""}
                            type="text" // Set the type to "text" for name input
                            style={{ width: "215px" }}
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name="ekipmanID"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text" // Set the type to "text" for name input
                            style={{ display: "none" }}
                          />
                        )}
                      />
                      <EkipmanTablo
                        onSubmit={(selectedData) => {
                          setValue("ekipman", selectedData.EKP_KOD);
                          setValue("ekipmanID", selectedData.key);
                          setValue("ekipmanTanim", selectedData.EKP_TANIM);
                        }}
                      />
                      <Button onClick={handleEkipmanMinusClick}> - </Button>
                    </div>
                    <Controller
                      name="ekipmanTanim"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text" // Set the type to "text" for name input
                          style={{ width: "215px" }}
                          disabled
                        />
                      )}
                    />
                  </div>
                  {errors.ekipman && <div style={{ color: "red", marginTop: "5px" }}>{errors.ekipman.message}</div>}
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
                <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.makineDurumu ? "600" : "normal" }}>
                  Makine Durumu:
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    maxWidth: "300px",
                    gap: "10px",
                    width: "100%",
                  }}>
                  <MakineDurumu fieldRequirements={fieldRequirements} />
                </div>
              </StyledDivBottomLine>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
