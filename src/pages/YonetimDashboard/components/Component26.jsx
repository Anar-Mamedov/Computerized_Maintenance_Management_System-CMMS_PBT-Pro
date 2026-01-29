import React from "react";
import { Typography } from "antd";
import { RightCircleOutlined, FilterOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const { Text, Title } = Typography;

// Mock Veri: Arıza Nedenleri ve Maliyetleri
const failureData = [
  { name: "Hidrolik", value: 950000 },
  { name: "Elektrik", value: 720000 },
  { name: "Motor", value: 640000 },
  { name: "Lastik", value: 480000 },
  { name: "Şanzıman", value: 320000 },
];

// Renk Paleti (En yüksekten düşüğe doğru tonlama yapılabilir veya sabit renk)
const BAR_COLOR = "#FF7A45"; // Turuncu tonu (Arıza çağrışımı)

function AylikBakimMaliyetleri() { // Bileşen ismini değiştirmedim, mevcut yapıyı bozmamak için
  
  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "white", padding: "8px 12px", border: "1px solid #f0f0f0", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          <p style={{ margin: 0, fontWeight: "600", fontSize: "12px" }}>{label}</p>
          <p style={{ margin: 0, color: BAR_COLOR, fontSize: "12px" }}>
            {`₺${(payload[0].value / 1000).toLocaleString("tr-TR")}k`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0", gap: "15px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#1f1f1f" }}>
            Arıza Nedenleri Maliyetleri
          </Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            En maliyetli arıza kategorileri (örnek veri)
          </Text>
        </div>
        {/* Şantiye Filtresi Uyarısı (Opsiyonel İkon) */}
        <Tooltip title="Şantiye filtresi desteklenir">
            <div style={{ cursor: "pointer", padding: "4px", backgroundColor: "#fafafa", borderRadius: "4px" }}>
                <FilterOutlined style={{ color: "#8c8c8c" }} />
            </div>
        </Tooltip>
      </div>

      {/* CHART CONTENT */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={failureData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barCategoryGap={10}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => `${val / 1000}k`} 
                tick={{ fontSize: 11, fill: "#8c8c8c" }}
            />
            <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#595959", fontWeight: 500 }}
                width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                {failureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLOR} fillOpacity={1 - (index * 0.1)} /> // Hafif ton farkı
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#1890ff", cursor: "pointer", fontSize: "12px" }}>
            <span>Tıkla → kategori detayı</span>
        </div>
        <Text type="secondary" style={{ fontSize: "11px", fontStyle: "italic" }}>
            Şantiye filtresi
        </Text>
      </div>

    </div>
  );
}

export default AylikBakimMaliyetleri;