import React, { useEffect } from "react";
import { Typography, Input, InputNumber, Switch, Button } from "antd"; 
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import { MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function MainTabs({ modalOpen }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (modalOpen) {
      // Modal açıldığında yapılacak işlemler
    }
  }, [modalOpen, setValue]);

  // --- Stiller ---
  const LabelStyle = {
    display: "flex",
    fontSize: "14px",
    flexDirection: "row",
    alignItems: "center",
    minWidth: "120px", 
    color: "#666"
  };

  const InputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "350px", // İnputlar için sınır
  };

  const RowStyle = {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    width: "100%",
    marginBottom: "10px",
    gap: "10px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "40px", width: "100%", padding: "10px" }}>
      
      {/* SOL KOLON - GENEL BİLGİLER */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "300px" }}>
        
        <div style={{ marginBottom: "15px" }}>
            <Text style={{ color: "#1890ff", fontWeight: "600", fontSize: "15px" }}>
            Genel Bilgiler
            </Text>
        </div>

        {/* Kod */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Kod")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="yakitKod"
              control={control}
              render={({ field }) => (
                <Input {...field} style={{ width: "100%" }} />
              )}
            />
          </div>
        </div>

        {/* Tanım */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Tanım")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="yakitTanim"
              control={control}
              render={({ field }) => (
                <Input {...field} style={{ width: "100%" }} />
              )}
            />
          </div>
        </div>

        {/* Tip (Select) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Tip")}</Text>
          <div style={InputContainerStyle}>
            <KodIDSelectbox 
                name1="yakitTipId" 
                kodID={35600} 
                isAsync={false}
                placeholder="BENZİN / AKARYAKIT"
            />
          </div>
        </div>

        {/* Birim (Select) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Birim")}</Text>
          <div style={InputContainerStyle}>
             <KodIDSelectbox 
                name1="birimId" 
                kodID={32001} 
                isAsync={false}
                placeholder="LT"
            />
          </div>
        </div>

        {/* Grup (Select) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Grup")}</Text>
          <div style={InputContainerStyle}>
             <KodIDSelectbox 
                name1="grupId" 
                kodID={35601} 
                isAsync={false}
                placeholder="(Seçiniz)"
            />
          </div>
        </div>

      </div>

      {/* SAĞ KOLON - DURUM BİLGİLERİ (Giren Miktar Satırında 3. Kolon Etkisi) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "300px" }}>
        
        <div style={{ marginBottom: "15px" }}>
            <Text style={{ color: "#1890ff", fontWeight: "600", fontSize: "15px" }}>
            Durum Bilgileri
            </Text>
        </div>

        {/* Giren Miktar + Aktif Switch (3. Kolon Gibi) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Giren Miktar")}</Text>
          
          <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "48px" }}> {/* gap arttırıldı */}
            
            {/* Input (2. Kolon) */}
            <div style={{ flex: 1, maxWidth: "350px" }}>
                <Controller
                  name="girenMiktar"
                  control={control}
                  render={({ field }) => (
                    <InputNumber 
                        {...field} 
                        style={{ width: "100%" }} 
                        disabled 
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        defaultValue={0.00}
                    />
                  )}
                />
            </div>

            {/* Aktif Switch (3. Kolon) - Sabit genişlikte ve inputtan ayrı */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "80px" }}>
                  <Text style={{ fontSize: "13px", color: "#666" }}>{t("Aktif")}</Text>
                  <Controller
                    name="aktif"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                      <Switch 
                        checked={field.value} 
                        onChange={(checked) => field.onChange(checked)} 
                      />
                    )}
                  />
            </div>

          </div>
        </div>

        {/* Çıkan Miktar */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Çıkan Miktar")}</Text>
          <div style={{ width: "100%", maxWidth: "350px" }}> {/* Diğerleri ile aynı genişlik */}
            <Controller
              name="cikanMiktar"
              control={control}
              render={({ field }) => (
                <InputNumber 
                    {...field} 
                    style={{ width: "100%" }} 
                    disabled 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    defaultValue={0.00}
                />
              )}
            />
          </div>
          {/* 3. Kolon boşluk doldurma (Opsiyonel: Hizayı korumak için sağa boş div eklenebilir ama şu an gerek yok) */}
          <div style={{ minWidth: "80px", marginLeft: "40px" }}></div> 
        </div>

        {/* Stok Miktarı */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Stok Miktarı")}</Text>
          <div style={{ width: "100%", maxWidth: "350px" }}>
            <div style={{ display: 'flex', gap: '5px' }}>
                <Controller
                name="stokMiktari"
                control={control}
                render={({ field }) => (
                    <Input 
                        {...field} 
                        style={{ flex: 1, textAlign: 'right' }} 
                        disabled 
                        placeholder="0,00 Lt"
                    />
                )}
                />
                <Button icon={<MoreOutlined />} />
            </div>
          </div>
          <div style={{ minWidth: "80px", marginLeft: "40px" }}></div>
        </div>

        {/* Son Alış Tarihi */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Son Alış Tarihi")}</Text>
          <div style={{ width: "100%", maxWidth: "350px" }}>
            <Controller
              name="sonAlisTarihi"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled placeholder="—" />
              )}
            />
          </div>
          <div style={{ minWidth: "80px", marginLeft: "40px" }}></div>
        </div>

        {/* Son Alınan Firma */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Son Alınan Firma")}</Text>
          <div style={{ width: "100%", maxWidth: "350px" }}>
            <Controller
              name="sonAlinanFirma"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled placeholder="—" />
              )}
            />
          </div>
          <div style={{ minWidth: "80px", marginLeft: "40px" }}></div>
        </div>

      </div>
    </div>
  );
}