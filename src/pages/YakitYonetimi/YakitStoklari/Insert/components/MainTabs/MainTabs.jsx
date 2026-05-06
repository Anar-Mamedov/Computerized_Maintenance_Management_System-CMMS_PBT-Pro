import React, { useEffect, useState } from "react";
import { Typography, Input, InputNumber, Checkbox, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import AxiosInstance from "../../../../../../api/http";

const { Text } = Typography;
const { Option } = Select;

export default function MainTabs() {
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

  // --- Stiller ---
  const LabelStyle = {
    display: "flex",
    fontSize: "14px",
    flexDirection: "row",
    alignItems: "center",
    minWidth: "100px",
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
        
        <div style={RowStyle}>
  <Text style={LabelStyle} strong>
    {t("Depo Kodu")} <span style={{ color: "red" }}>*</span>
  </Text>
  <div style={InputContainerStyle}>
    <Controller
      name="DEP_KOD"
      control={control}
      rules={{ required: t("alanBosBirakilamaz") }} // Zorunlu
      render={({ field, fieldState: { error } }) => (
        <>
          <Input 
            {...field} 
            status={error ? "error" : ""} 
            placeholder={t("Depo Kodu")} 
          />
          {error && (
            <small style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {error.message}
            </small>
          )}
        </>
      )}
    />
  </div>

  {/* Depo Tanımı */}
  <Text style={LabelStyle} strong>
    {t("Depo Tanımı")} <span style={{ color: "red" }}>*</span>
  </Text>
  <div style={InputContainerStyle}>
    <Controller
      name="DEP_TANIM"
      control={control}
      rules={{ required: t("alanBosBirakilamaz") }} // Zorunlu
      render={({ field, fieldState: { error } }) => (
        <>
          <Input 
            {...field} 
            status={error ? "error" : ""} 
            placeholder={t("Tanım giriniz")} 
          />
          {error && (
            <small style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {error.message}
            </small>
          )}
        </>
      )}
    />
  </div>
</div>

        <div style={RowStyle}>
  <Text style={LabelStyle} strong>
    {t("Yakıt Tipi")} <span style={{ color: "red" }}>*</span>
  </Text>
  <div style={InputContainerStyle}>
    <Controller
      name="yakitTipKodId"
      control={control}
      rules={{ required: t("alanBosBirakilamaz") }} // Zorunlu
      render={({ field, fieldState: { error } }) => (
        <>
          <Select
            {...field}
            showSearch
            allowClear
            status={error ? "error" : ""} // Hata durumunda kırmızı çerçeve
            style={{ width: "100%" }}
            loading={loading}
            optionFilterProp="children"
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
          {error && (
            <small style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {error.message}
            </small>
          )}
        </>
      )}
    />
  </div>

          <Text style={LabelStyle}>{t("Lokasyon")}</Text>
          <div style={InputContainerStyle}>
            <LokasyonTablo
              lokasyonFieldName="lokasyonTanim"
              lokasyonIdFieldName="LOKASYON_ID"
              workshopSelectedId={watch("LOKASYON_ID")}
              isRequired={false}
            />
          </div>
        </div>

      </div>
    </div>
  );
}