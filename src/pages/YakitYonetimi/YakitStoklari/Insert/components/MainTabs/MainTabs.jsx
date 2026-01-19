import React from "react";
import { Typography, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import PersonelTablo from "../../../../../../utils/components/PersonelTablo";

const { Text } = Typography;

export default function MainTabs() {
  const {
    control,
    watch,
  } = useFormContext();

  // --- Stiller ---
  const LabelStyle = {
    display: "flex",
    fontSize: "14px",
    flexDirection: "row",
    alignItems: "center",
    minWidth: "120px",
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "40px",
        width: "100%",
        padding: "20px",
      }}
    >
      {/* SOL KOLON */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
          minWidth: "300px",
        }}
      >
        {/* 1. Depo Kodu (Input olduğu için Controller GEREKLİ) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Depo Kodu")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="DEP_KOD"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ width: "100%" }}
                  placeholder={t("Otomatik veya Manuel Kod")}
                />
              )}
            />
          </div>
        </div>

        {/* 2. Depo Tanımı (Input olduğu için Controller GEREKLİ) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Depo Tanımı")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="DEP_TANIM"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ width: "100%" }}
                  placeholder={t("Tanım giriniz")}
                />
              )}
            />
          </div>
        </div>

        {/* 3. Lokasyon Seçimi (Kendi içinde Controller var, buraya Controller KOYMA) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Lokasyon")}</Text>
          <div style={InputContainerStyle}>
            <LokasyonTablo
              // Form Context içindeki alan isimlerini buraya gönderiyoruz
              lokasyonFieldName="LOKASYON" 
              lokasyonIdFieldName="LOKASYON_ID"
              
              // Eğer modal açıldığında seçili gelmesini istersen:
              workshopSelectedId={watch("LOKASYON_ID")}
              
              isRequired={false}
            />
          </div>
        </div>

        {/* 4. Sorumlu Personel Seçimi (Kendi içinde Controller var, buraya Controller KOYMA) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Sorumlu Personel")}</Text>
          <div style={InputContainerStyle}>
            <PersonelTablo
              // Bileşen içinde `const fieldIdName = ${name1}ID;` mantığı var.
              // name1="PERSONEL" dersek, ID alanı "PERSONELID" olarak oluşur.
              name1="PERSONEL"
              
              // Eğer modal açıldığında seçili gelmesini istersen:
              workshopSelectedId={watch("PERSONELID")}
              
              isRequired={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}