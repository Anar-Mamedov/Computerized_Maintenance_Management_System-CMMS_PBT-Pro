import React from "react";
import {
  Typography,
  Input,
  Checkbox,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

const { Text } = Typography;

const StyledInput = styled(Input)`
  max-width: 300px;
  width: 100%;
`;

export default function MainTabs() {
  const { control } = useFormContext();

  const booleanFields = [
    { label: "Tedarikçi", name: "carTedarikci" },
    { label: "Müşteri", name: "carMusteri" },
    { label: "Nakliyeci", name: "carNakliyeci" },
    { label: "Servis", name: "carServis" },
    { label: "Şube", name: "carSube" },
    { label: "Diğer", name: "carDiger" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "15px",
        gap: "20px",
      }}
    >
      {/* Sol Kolon - Text Inputlar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        {[
          { label: "Firma Kodu", name: "carKod", required: true },
          { label: "Firma Tanımı", name: "carTanim", required: true },
          { label: "Adres", name: "carAdres" },
          { label: "Şehir", name: "carSehir" },
          { label: "İlçe", name: "carIlce" },
          { label: "Telefon", name: "carTel1" },
          { label: "Email", name: "carEmail" },
          { label: "Vergi Dairesi", name: "carVergiDaire" },
          { label: "Vergi No", name: "carVergiNo" },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>
              {item.label}:
            </Text>
            <Controller
              name={item.name}
              control={control}
              rules={item.required ? { required: "Alan Boş Bırakılamaz!" } : {}}
              render={({ field, fieldState: { error } }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px", width: "100%" }}>
                  <StyledInput {...field} status={error ? "error" : ""} />
                  {error && <div style={{ color: "red" }}>{error.message}</div>}
                </div>
              )}
            />
          </div>
        ))}
      </div>

      {/* Sağ Kolon - Boolean alanlar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        {booleanFields.map((item) => (
          <Controller
            key={item.name}
            name={item.name}
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                {item.label}
              </Checkbox>
            )}
          />
        ))}
      </div>
    </div>
  );
}