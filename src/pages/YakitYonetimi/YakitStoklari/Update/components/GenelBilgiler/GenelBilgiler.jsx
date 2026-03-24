import React, { useEffect, useState } from "react";
import { Select, Input, Typography, Divider, InputNumber, Button, Checkbox } from "antd";
import GirisFiyatiSelect from "./components/GirisFiyatiSelect";
import CikisiyatiSelect from "./components/CikisiyatiSelect";
import FiyatGirisleri from "./components/FiyatGirisleri/FiyatGirisleri";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import AxiosInstance from "../../../../../../api/http";

const { Text } = Typography;
const { Option } = Select;

function GenelBilgiler({ selectedRowID }) {
  const { control, watch } = useFormContext();
  const [yakitListesi, setYakitListesi] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchYakitListesi = async () => {
      setLoading(true);
      try {
        // API URL'ini kendi yapına göre düzenle
        const response = await AxiosInstance.get("GetYakitList?aktif=true");
        // Gelen veriyi state'e aktar
        setYakitListesi(response || []); 
      } catch (error) {
        console.error("Yakıt listesi çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchYakitListesi();
  }, []);

  // --- Anlık Değerleri İzleme (Tank görseli için) ---
  const kapasite = watch("kapasite") || 0;       // KAPASITE değil, kapasite
  const mevcutMiktar = watch("mevcutMiktar") || 0; 
  const kritikMiktar = watch("kritikMiktar") || 0;
  
  // Doluluk oranı hesabı
  const dolulukOrani = kapasite > 0 ? (mevcutMiktar / kapasite) * 100 : 0;
  const safeDoluluk = Math.min(100, Math.max(0, dolulukOrani));
  
  // Kritik uyarı rengi
  const tankColor = mevcutMiktar <= kritikMiktar ? "#f5222d" : "#52c41a";

  // --- Stiller ---
  const LabelStyle = {
    display: "flex",
    fontSize: "14px",
    fontWeight: "600",
    alignItems: "center",
    minWidth: "120px",
  };

  const InputContainerStyle = {
    display: "flex",
    width: "100%",
    maxWidth: "300px",
  };

  const RowStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    gap: "10px",
  };

  return (
    <div style={{ padding: "20px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
      
      {/* SOL TARA: TANK GÖRSELİ */}
      <div
        style={{
          width: "150px",
          height: "200px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          backgroundColor: "#f5f5f5",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end", // Sıvıyı aşağıdan başlat
          overflow: "hidden",
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        {/* Üstteki Boşluk Kısmı (Görsel efekt için) */}
        <div style={{ position: "absolute", top: 10, left: 0, width: "100%", textAlign: "center", zIndex: 2 }}>
           {/* İstersen buraya depo adı vs yazılabilir */}
        </div>

        {/* Sıvı Kısmı */}
        <div
  style={{
    height: `${safeDoluluk}%`,
    backgroundColor: tankColor,
    width: "100%",
    position: "relative",
    // Fizik Animasyonu Buraya:
    animation: "tankFillPhysics 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
    transformOrigin: "bottom", // Dolum aşağıdan yukarı olsun
    transition: "height 1s ease-in-out, background-color 0.5s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  }}
>
  {/* Dalga Efekti (Opsiyonel: Daha canlı dursun diye üst kısma beyazımsı bir katman) */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'rgba(255,255,255,0.3)',
    filter: 'blur(2px)'
  }} />
</div>
        
        {/* Yüzde Yazısı (Ortada dursun diye absolute veriyoruz) */}
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            fontSize: '18px',
            color: dolulukOrani > 55 ? '#fff' : '#000', // Arka plan koyuysa yazı beyaz olsun
            zIndex: 3
        }}>
            %{Math.round(safeDoluluk)}
        </div>
      </div>

      {/* SAĞ TARAF: FORM ALANLARI */}
      <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        
        {/* 1. Yakıt Tipi */}
        <div style={RowStyle}>
                  <Text style={LabelStyle}>{t("Yakıt Tipi")}</Text>
                  <div style={InputContainerStyle}>
                    <Controller
                      name="yakitTipTanim" // Formda hangi key ile tutulacaksa
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          showSearch
                          allowClear
                          style={{ width: "100%" }}
                          loading={loading}
                          optionFilterProp="children"
                          // Arama yaparken hem koda hem tanıma bakması için:
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {yakitListesi.map((item) => (
                            <Option key={item.TB_STOK_ID} value={item.TB_STOK_ID}>
                              {`${item.YAKIT_KOD} - ${item.YAKIT_TANIM}`}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                </div>

        {/* 2. Tank Kapasitesi */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Tank Kapasitesi")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="kapasite"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  parser={(value) => value.replace(/\./g, "")}
                  min={0}
                />
              )}
            />
          </div>
        </div>

        {/* 3. Kritik Miktar ve Uyar Checkbox */}
        <div style={RowStyle}>
          <Text style={{ ...LabelStyle, color: "blue" }}>{t("Kritik Miktar")}</Text>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "300px" }}>
            <Controller
              name="kritikMiktar"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ flex: 1 }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  parser={(value) => value.replace(/\./g, "")}
                  min={0}
                />
              )}
            />
            <Controller
              name="kritikUyar"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} {...field}>
                  {t("Uyar")}
                </Checkbox>
              )}
            />
          </div>
        </div>

        {/* 4. Yakıt Miktarı (Mevcut) - Sarı Arkaplanlı */}
        <div style={{ ...RowStyle, marginTop: "20px" }}>
          <Text style={LabelStyle}>{t("Yakıt Miktarı")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="mevcutMiktar"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  readOnly
                  style={{ 
                      width: "100%",
                      fontWeight: "bold",
                      color: "#000"
                  }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  parser={(value) => value.replace(/\./g, "")}
                />
              )}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default GenelBilgiler;