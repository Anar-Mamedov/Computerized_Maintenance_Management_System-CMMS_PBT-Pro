import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Table, Button, Form as AntForm, Input, InputNumber, Popconfirm, Modal, Typography, message, Radio, Select } from "antd";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";

const { Text } = Typography;

// --- Stillendirme Yardımcıları (MainTabs'den uyumlu) ---
const LabelStyle = {
  display: "flex",
  fontSize: "14px",
  flexDirection: "row",
  alignItems: "center",
  minWidth: "100px", 
  color: "#666" 
};

const InputContainerStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "350px", 
};

const RowStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: "10px",
  gap: "10px",
};

function FisIcerigi({ modalOpen }) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [selectedRowId, setSelectedRowId] = useState(null);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "detayBilgileri",
    shouldUnregister: true,
    shouldFocus: false,
  });

  const [dataSource, setDataSource] = useState([]);
  const selectedRowData = dataSource.find((item) => item.malzemeId === selectedRowId);

  // --- (Totals calculation useEffects ve diğer helper fonksiyonlar buraya gelebilir, 
  //      kodun okunabilirliği için önceki versiyondaki logicleri koruduğunu varsayıyorum) ---

  // Safely update dataSource when fields change
  useEffect(() => {
    try {
      setDataSource(fields || []);
    } catch (error) {
      console.error("Error updating dataSource:", error);
      setDataSource([]);
    }
  }, [fields]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* ÜST KISIM: FİYAT BİLGİLERİ VE ANALİZİ (YENİ EKLENDİ) */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "40px", width: "100%", padding: "10px" }}>
        
        {/* SOL KOLON - FİYAT BİLGİLERİ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "300px" }}>
            <Text style={{ color: "#1890ff", fontWeight: "600", fontSize: "15px", marginBottom: "5px" }}>
                Fiyat Bilgileri
            </Text>

            {/* Giriş Fiyatı */}
            <div style={RowStyle}>
                <Text style={LabelStyle}>Giriş Fiyatı</Text>
                <div style={{...InputContainerStyle, flexDirection: 'row', gap: '5px'}}>
                    <Controller
                        name="girisFiyatiTipi"
                        control={control}
                        defaultValue="Son Alış Fiyatı"
                        render={({ field }) => (
                            <Select {...field} style={{ flex: 2 }}>
                                <Select.Option value="Son Alış Fiyatı">Son Alış Fiyatı</Select.Option>
                                <Select.Option value="Ortalama Fiyat">Ortalama Fiyat</Select.Option>
                            </Select>
                        )}
                    />
                    <Controller
                        name="girisFiyati"
                        control={control}
                        render={({ field }) => (
                            <InputNumber {...field} style={{ flex: 1 }} defaultValue={0.00} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                        )}
                    />
                </div>
            </div>

            {/* Çıkış Fiyatı */}
            <div style={RowStyle}>
                <Text style={LabelStyle}>Çıkış Fiyatı</Text>
                <div style={{...InputContainerStyle, flexDirection: 'row', gap: '5px'}}>
                    <Controller
                        name="cikisFiyatiTipi"
                        control={control}
                        defaultValue="Ortalama Fiyat"
                        render={({ field }) => (
                            <Select {...field} style={{ flex: 2 }}>
                                <Select.Option value="Son Alış Fiyatı">Son Alış Fiyatı</Select.Option>
                                <Select.Option value="Ortalama Fiyat">Ortalama Fiyat</Select.Option>
                            </Select>
                        )}
                    />
                    <Controller
                        name="cikisFiyati"
                        control={control}
                        render={({ field }) => (
                            <InputNumber {...field} style={{ flex: 1 }} defaultValue={0.00} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                        )}
                    />
                </div>
            </div>

            {/* KDV */}
            <div style={RowStyle}>
                <Text style={LabelStyle}>Kdv (%)</Text>
                <div style={InputContainerStyle}>
                    <Controller
                        name="kdvOrani"
                        control={control}
                        render={({ field }) => (
                            <InputNumber {...field} style={{ width: "100%" }} defaultValue={18} />
                        )}
                    />
                </div>
            </div>

            {/* Fiyat Girişleri Butonu */}
            <div style={{ marginTop: "10px" }}>
                <Button block>Fiyat Girişleri</Button>
            </div>

        </div>

        {/* SAĞ KOLON - FİYAT ANALİZİ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "300px" }}>
            <Text style={{ color: "#1890ff", fontWeight: "600", fontSize: "15px", marginBottom: "5px" }}>
                Fiyat Analizi
            </Text>

            {/* En Yüksek Fiyat */}
            <div style={RowStyle}>
                <Text style={LabelStyle}>En Yüksek Fiyat</Text>
                <div style={InputContainerStyle}>
                    <Input disabled style={{ textAlign: "right" }} />
                </div>
            </div>

            {/* En Düşük Fiyat */}
            <div style={RowStyle}>
                <Text style={LabelStyle}>En Düşük Fiyat</Text>
                <div style={InputContainerStyle}>
                    <Input disabled style={{ textAlign: "right" }} />
                </div>
            </div>

            {/* Ortalama Fiyat */}
            <div style={RowStyle}>
                <Text style={LabelStyle}>Ortalama Fiyat</Text>
                <div style={InputContainerStyle}>
                    <Input disabled style={{ textAlign: "right" }} />
                </div>
            </div>

            {/* İlk Alış Fiyat */}
            <div style={RowStyle}>
                <Text style={LabelStyle}>İlk Alış Fiyat</Text>
                <div style={InputContainerStyle}>
                    <Input disabled style={{ textAlign: "right" }} />
                </div>
            </div>

            {/* Son Alış Fiyatı */}
            <div style={RowStyle}>
                <Text style={LabelStyle}>Son Alış Fiyatı</Text>
                <div style={InputContainerStyle}>
                    <Input disabled style={{ textAlign: "right" }} />
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default FisIcerigi;