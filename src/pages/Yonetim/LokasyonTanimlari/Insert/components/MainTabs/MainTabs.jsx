import React from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import LokasyonTipi from "./components/LokasyonTipi";
import LokasyonBina from "./components/LokasyonBina";
import MasrafMerkeziTablo from "./components/MasrafMerkeziTablo";
import LokasyonKat from "./components/LokasyonKat";

const { Text, Link } = Typography;

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  const handleMinusClick = () => {
    setValue("masterMakineTanimi", "");
    setValue("masterMakineID", "");
  };

  const handleTakvimMinusClick = () => {
    setValue("makineTakvimTanimi", "");
    setValue("makineTakvimID", "");
  };

  const selectedLokasyonId = watch("selectedLokasyonId");

  return (
    <>
      <div style={{ display: "flex", marginBottom: "15px", flexDirection: "column", gap: "10px", maxWidth: "800px" }}>
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
              maxWidth: "650px",
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
              maxWidth: "340px",
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
                name="makineMasrafMerkeziTanim"
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
                name="makineMasrafMerkeziID"
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
                  setValue("makineMasrafMerkeziTanim", selectedData.age);
                  setValue("makineMasrafMerkeziID", selectedData.key);
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
              maxWidth: "340px",
              gap: "10px",
              width: "100%",
            }}>
            <LokasyonKat />
          </div>
        </div>
      </div>
    </>
  );
}
