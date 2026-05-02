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
    minWidth: "80px",
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

        {/* Depo Tanımı */}
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

      </div>
    </div>
  );
}