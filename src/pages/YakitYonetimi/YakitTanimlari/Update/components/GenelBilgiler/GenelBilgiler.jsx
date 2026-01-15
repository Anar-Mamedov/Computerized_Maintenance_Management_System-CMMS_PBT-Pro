import React from "react";
import { Select, Input, Typography, Divider, InputNumber, Button } from "antd";
import GirisFiyatiSelect from "./components/GirisFiyatiSelect";
import CikisiyatiSelect from "./components/CikisiyatiSelect";
import FiyatGirisleri from "./components/FiyatGirisleri/FiyatGirisleri";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Text } = Typography;

function GenelBilgiler({ selectedRowID }) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  // Ortak Input Stili (Sol taraf için)
  const inputStyle = { width: "100%" };

  // --- 1. AYAR: Sağ taraftaki inputları kutuya sığacak şekilde küçülttük ---
  const shortInputStyle = { width: "340px" }; 
  
  // Sol Panel Satır Stili
  const leftRowStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    justifyContent: "space-between",
  };

  // Sağ Panel Satır Stili
  const rightRowStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    gap: "10px" // justify-content space-between kullandığımız için gap'e gerek kalmayabilir ama durabilir
  };

  // Label Stili
  const labelStyle = {
    width: "120px",
    fontSize: "14px",
    color: "#444",
    flexShrink: 0,
  };

  // Para birimi formatlayıcı
  const currencyFormatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const currencyParser = (value) => value.replace(/\s?₺|(,*)/g, "");

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: "wrap" }}>
      
      {/* --- SOL PANEL: FİYAT BİLGİLERİ --- */}
      <div
        style={{
          flex: 1, // Sol taraf kalan boşluğu doldursun
          minWidth: "450px",
          border: "1px solid #e8e8e8",
          padding: "15px",
          borderRadius: "4px",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <Text style={{ color: "#0062ff", fontWeight: "600", fontSize: "15px" }}>
            {t("fiyatBilgileri")}
          </Text>
        </div>

        {/* Giriş Fiyatı */}
        <div style={leftRowStyle}>
          <Text style={labelStyle}>{t("girisFiyati")}</Text>
          <div style={{ display: "flex", gap: "10px", flex: 1 }}>
            <div style={{ flex: 2 }}>
              <GirisFiyatiSelect />
            </div>
            <div style={{ flex: 1 }}>
              <Controller
                name="girisFiyati"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={inputStyle}
                    disabled={watch("girisFiyatTuru") !== 6} 
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Çıkış Fiyatı */}
        <div style={leftRowStyle}>
          <Text style={labelStyle}>{t("cikisFiyati")}</Text>
          <div style={{ display: "flex", gap: "10px", flex: 1 }}>
            <div style={{ flex: 2 }}>
              <CikisiyatiSelect />
            </div>
            <div style={{ flex: 1 }}>
              <Controller
                name="cikisFiyati"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={inputStyle}
                    disabled={watch("cikisFiyatTuru") !== 6}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* KDV */}
        <div style={leftRowStyle}>
          <Text style={labelStyle}>{t("Kdv (%)")}</Text>
          <div style={{ display: "flex", gap: "10px", flex: 1 }}>
            <div style={{ width: "80px" }}>
                <Controller
                    name="kdv"
                    control={control}
                    render={({ field }) => <InputNumber {...field} min={0} max={100} style={{ width: "100%" }} />}
                />
            </div>
          </div>
        </div>

        {/* Buton */}
        <div style={{ marginTop: "20px" }}>
            <FiyatGirisleri selectedRowID={selectedRowID} materialCode={watch("malzemeKod")} style={{ width: '100%' }} /> 
        </div>
      </div>

      {/* --- SAĞ PANEL: FİYAT ANALİZİ --- */}
      <div
        style={{
          // --- 2. AYAR: flex: 1 yerine sabit genişlik veriyoruz ---
          width: "600px",      // Kutuyu daralttık
          minWidth: "350px",   // Küçüldüğünde bozulmasın
          flex: "none",        // Esnemeyi kapattık
          // --------------------------------------------------------
          border: "1px solid #e8e8e8",
          padding: "15px",
          borderRadius: "4px",
          backgroundColor: "#fff",
          height: "fit-content" // İçerik kadar yükseklik
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <Text style={{ color: "#0062ff", fontWeight: "600", fontSize: "15px" }}>
            {t("Fiyat Analizi")}
          </Text>
        </div>

        <div style={rightRowStyle}>
          <Text style={labelStyle}>{t("En Yüksek Fiyat")}</Text>
          <Controller
            name="enYuksekFiyat"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                readOnly
                style={shortInputStyle}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            )}
          />
        </div>

        <div style={rightRowStyle}>
          <Text style={labelStyle}>{t("En Düşük Fiyat")}</Text>
          <Controller
            name="enDusukFiyat"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                readOnly
                style={shortInputStyle}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            )}
          />
        </div>

        <div style={rightRowStyle}>
          <Text style={labelStyle}>{t("Ortalama Fiyat")}</Text>
          <Controller
            name="ortalamaFiyat"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                readOnly
                style={shortInputStyle}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            )}
          />
        </div>

        <div style={rightRowStyle}>
          <Text style={labelStyle}>{t("İlk Alış Fiyat")}</Text>
          <Controller
            name="ilkAlisFiyati"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                readOnly
                style={shortInputStyle}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            )}
          />
        </div>

        <div style={rightRowStyle}>
          <Text style={labelStyle}>{t("Son Alış Fiyatı")}</Text>
          <Controller
            name="sonAlisFiyati"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                readOnly
                style={shortInputStyle}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            )}
          />
        </div>

      </div>
    </div>
  );
}

export default GenelBilgiler;