import { Checkbox, ColorPicker, Input, Radio, Typography } from "antd";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import SecondTabs from "./SecondTabs";

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

export default function EditTabs() {
  const { control, watch, setValue } = useFormContext();

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "525px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>İş Emri Tanımı:</Text>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller
              name="isEmriTipiTanim"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                  {error && <div style={{ color: "red" }}>{error.message}</div>}
                </div>
              )}
            />
            <Controller
              name="secilenID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="varsayilanIsEmriTipi"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Varsayılan
                </Checkbox>
              )}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "418px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px" }}>Renk:</Text>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller
              name="isEmriTipiRenk"
              control={control}
              render={({ field }) => (
                <ColorPicker
                  {...field}
                  showText
                  onChange={(color) => {
                    // Rengi hex formatında al
                    const hexColor = color.toHexString();
                    // Form durumunu güncelle
                    field.onChange(hexColor);
                  }}
                />
              )}
            />

            <Controller
              name="aktifIsEmriTipi"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Aktif
                </Checkbox>
              )}
            />
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <Text style={{ position: "relative", top: "10px", backgroundColor: "white", left: "10px" }}>Prosedür Tipi</Text>
        <div
          style={{
            border: "1px solid #80808068",
            borderRadius: "5px",
            padding: "10px",
            maxWidth: "460px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Controller
            name="tipGroup"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field}>
                <Radio value={1}>Arıza</Radio>
                <Radio value={2}>Bakım</Radio>
                <Radio value={3}>Periyodik Bakım</Radio>
                <Radio value={4}>İş Talebi</Radio>
                <Radio value={5}>Diger</Radio>
              </Radio.Group>
            )}
          />
        </div>
      </div>
      <SecondTabs />
    </div>
  );
}
