import React from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import LokasyonTipi from "./components/LokasyonTipi";
import LokasyonBina from "./components/LokasyonBina";
import MasrafMerkeziTablo from "./components/MasrafMerkeziTablo";
import LokasyonKat from "./components/LokasyonKat";
import LokasyonPersonelTablo from "./components/LokasyonPersonelTablo";
import LokasyonDepoTablo from "./components/LokasyonDepoTablo";
import styled from "styled-components";
import LokasyonTablo from "./components/LokasyonTablo";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledInput = styled(Input)`
  @media (min-width: 600px) {
    max-width: 720px;
  }
  @media (max-width: 600px) {
    max-width: 300px;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    width: 100%;
    max-width: 720px;
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    alignitems: "center";
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 720px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  const handleMinusClick = () => {
    setValue("lokasyonMasrafMerkeziTanim", "");
    setValue("lokasyonMasrafMerkeziID", "");
  };

  const handleYoneticiMinusClick = () => {
    setValue("lokasyonYoneticiTanim", "");
    setValue("lokasyonYoneticiID", "");
  };

  const handleDepoMinusClick = () => {
    setValue("lokasyonDepoTanim", "");
    setValue("lokasyonDepoID", "");
  };

  const handleAnaLokasyonMinusClick = () => {
    setValue("anaLokasyonTanim", "");
    setValue("anaLokasyonID", "");
  };

  const selectedLokasyonId = watch("selectedLokasyonId");

  return (
    <div style={{ display: "flex", marginBottom: "15px", flexDirection: "column", gap: "10px", maxWidth: "870px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: "10px",
          rowGap: "0px",
        }}>
        <Text style={{ fontSize: "14px" }}>Lokasyon Tanımı:</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "720px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}>
          <Controller
            name="lokasyonTanimi"
            control={control}
            render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
          />
          <Controller
            name="selectedLokasyonId"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <Controller
            name="lokasyonAktif"
            control={control}
            defaultValue={true} // or true if you want it checked by default
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Aktif
              </Checkbox>
            )}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
          }}>
          <LokasyonTipi />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "410px",
            gap: "10px",
            width: "100%",
          }}>
          <LokasyonBina />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
          }}>
          <Text style={{ fontSize: "14px" }}>Masraf Merkezi:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="lokasyonMasrafMerkeziTanim"
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
            <Controller
              name="lokasyonMasrafMerkeziID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <MasrafMerkeziTablo
              onSubmit={(selectedData) => {
                setValue("lokasyonMasrafMerkeziTanim", selectedData.age);
                setValue("lokasyonMasrafMerkeziID", selectedData.key);
              }}
            />
            <Button onClick={handleMinusClick}> - </Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "410px",
            gap: "10px",
            width: "100%",
          }}>
          <LokasyonKat />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
          }}>
          <Text style={{ fontSize: "14px" }}>Yönetici:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="lokasyonYoneticiTanim"
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
            <Controller
              name="lokasyonYoneticiID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <LokasyonPersonelTablo
              onSubmit={(selectedData) => {
                setValue("lokasyonYoneticiTanim", selectedData.subject);
                setValue("lokasyonYoneticiID", selectedData.key);
              }}
            />
            <Button onClick={handleYoneticiMinusClick}> - </Button>
          </div>
        </StyledDivBottomLine>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "410px",
          }}>
          <Text style={{ fontSize: "14px" }}>Malzeme Depo:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="lokasyonDepoTanim"
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
            <Controller
              name="lokasyonDepoID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <LokasyonDepoTablo
              onSubmit={(selectedData) => {
                setValue("lokasyonDepoTanim", selectedData.subject);
                setValue("lokasyonDepoID", selectedData.key);
              }}
            />
            <Button onClick={handleDepoMinusClick}> - </Button>
          </div>
        </div>
      </div>
      <StyledDivMedia
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "870px",
        }}>
        <Text style={{ fontSize: "14px" }}>Ana Lokasyon:</Text>
        <div
          className="anar"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "300px",
            gap: "3px",
          }}>
          <Controller
            name="anaLokasyonTanim"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "100%", maxWidth: "630px" }}
                disabled
              />
            )}
          />
          <Controller
            name="anaLokasyonID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <LokasyonTablo
            onSubmit={(selectedData) => {
              setValue("anaLokasyonTanim", selectedData.LOK_TANIM);
              setValue("anaLokasyonID", selectedData.key);
            }}
          />
          <Button onClick={handleAnaLokasyonMinusClick}> - </Button>
        </div>
      </StyledDivMedia>
      <StyledDivBottomLine
        style={{
          display: "flex",
          flexWrap: "wrap",

          justifyContent: "space-between",
          width: "100%",
        }}>
        <Text style={{ fontSize: "14px" }}>E-Mail:</Text>
        <Controller
          name="lokasyonEmail"
          control={control}
          render={({ field }) => (
            <StyledInput
              {...field}
              type="text" // Set the type to "text" for name input
            />
          )}
        />
      </StyledDivBottomLine>
      <StyledDivBottomLine
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
        }}>
        <Text style={{ fontSize: "14px" }}>Açıklama:</Text>
        <StyledDiv>
          <Controller
            name="lokasyonAciklama"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                type="text" // Set the type to "text" for name input
              />
            )}
          />
        </StyledDiv>
      </StyledDivBottomLine>
    </div>
  );
}
