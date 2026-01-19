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

        {/* --- KOD ve AKTİF (YAN YANA) --- */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Kod")}</Text>
          {/* InputContainerStyle'ı override edip row yapıyoruz */}
          <div style={{ ...InputContainerStyle, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            
            {/* Kod Inputu */}
            <div style={{ flex: 1, marginRight: "10px" }}>
                <Controller
                name="kod"
                control={control}
                render={({ field }) => (
                    <Input {...field} style={{ width: "100%" }} />
                )}
                />
            </div>

            {/* Aktif Switch */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
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

        {/* Tanım (STK_TANIM) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Tanım")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="tanim"
              control={control}
              render={({ field }) => (
                <Input {...field} style={{ width: "100%" }} />
              )}
            />
          </div>
        </div>

        {/* Tip (STK_TIP_KOD_ID) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Tip")}</Text>
          <div style={InputContainerStyle}>
            <KodIDSelectbox name1="tip" isRequired={false} kodID="35600" />
          </div>
        </div>

        {/* Birim (STK_BIRIM_KOD_ID) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Birim")}</Text>
          <div style={InputContainerStyle}>
            <KodIDSelectbox name1="birim" isRequired={false} kodID="32001" />
          </div>
        </div>

        {/* Grup (STK_GRUP_KOD_ID) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Grup")}</Text>
          <div style={InputContainerStyle}>
             <KodIDSelectbox name1="grup" isRequired={false} kodID="35601" />
          </div>
        </div>

      </div>

      {/* SAĞ KOLON - DURUM BİLGİLERİ */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "300px" }}>
        
        <div style={{ marginBottom: "15px" }}>
            <Text style={{ color: "#1890ff", fontWeight: "600", fontSize: "15px" }}>
            Durum Bilgileri
            </Text>
        </div>

        {/* Giren Miktar (STK_GIREN_MIKTAR) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Giren Miktar")}</Text>
          <div style={{ width: "100%", maxWidth: "350px" }}> 
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
          <div style={{ minWidth: "80px", marginLeft: "10px" }}></div>
        </div>

        {/* Çıkan Miktar (STK_CIKAN_MIKTAR) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Çıkan Miktar")}</Text>
          <div style={{ width: "100%", maxWidth: "350px" }}> 
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
          <div style={{ minWidth: "80px", marginLeft: "10px" }}></div> 
        </div>

        {/* Stok Miktarı (STK_MIKTAR) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Stok Miktarı")}</Text>
          <div style={{ width: "100%", maxWidth: "350px" }}>
            <div style={{ display: 'flex', gap: '5px' }}>
                <Controller
                name="stokMiktar" 
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
          <div style={{ minWidth: "80px", marginLeft: "10px" }}></div>
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
          <div style={{ minWidth: "80px", marginLeft: "10px" }}></div>
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
          <div style={{ minWidth: "80px", marginLeft: "10px" }}></div>
        </div>

      </div>
    </div>
  );
}