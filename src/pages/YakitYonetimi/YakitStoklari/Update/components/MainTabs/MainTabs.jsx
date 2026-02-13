import React from "react";
import { Typography, Input, InputNumber, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import PersonelTablo from "../../../../../../utils/components/PersonelTablo";

const { Text } = Typography;

export default function MainTabs() {
  const { control, watch } = useFormContext();

  // --- Stiller ---
  const LabelStyle = {
    display: "flex",
    fontSize: "14px",
    flexDirection: "row",
    alignItems: "center",
    minWidth: "140px",
    fontWeight: 600,
  };

  const InputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px",
  };

  const RowStyle = {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    width: "100%",
    marginBottom: "10px",
    gap: "15px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "40px", width: "100%", padding: "20px" }}>
      {/* SOL KOLON */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "400px" }}>
        
        {/* Depo Kodu */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Depo Kodu")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="kod"
              control={control}
              render={({ field }) => <Input {...field} placeholder={t("Depo Kodu")} />}
            />
          </div>
        </div>

        {/* Depo Tanımı */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Depo Tanımı")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="tanim"
              control={control}
              render={({ field }) => <Input {...field} placeholder={t("Tanım giriniz")} />}
            />
          </div>
        </div>

        {/* Lokasyon Seçimi */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Lokasyon")}</Text>
          <div style={InputContainerStyle}>
            <LokasyonTablo
              lokasyonFieldName="lokasyonTanim"
              lokasyonIdFieldName="lokasyonID"
              workshopSelectedId={watch("lokasyonID")}
              isRequired={false}
            />
          </div>
        </div>

        {/* Sorumlu Personel */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Sorumlu Personel")}</Text>
          <div style={InputContainerStyle}>
            <PersonelTablo
              name1="personelTanim" // API: SORUMLU_PERSONEL_AD
              workshopSelectedId={watch("personelID")} // API: SORUMLU_PERSONEL_ID
              isRequired={false}
              // Not: PersonelTablo bileşeninin iç mantığına göre name1="personel" 
              // dersen personelID ve personel isimlerini otomatik setler.
            />
          </div>
        </div>

      </div>
    </div>
  );
}