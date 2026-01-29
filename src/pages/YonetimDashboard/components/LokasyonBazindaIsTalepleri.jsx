import React from "react";
import { Typography } from "antd";
import { AlertOutlined, RightCircleOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const { Text, Title } = Typography;

// Mock Veri: Arıza Nedenleri (Tutar bazlı)
const failureCostData = [
  { name: "Hidrolik", value: 1550000 },
  { name: "Elektrik", value: 1150000 },
  { name: "Motor", value: 850000 },
  { name: "Yürüyüş", value: 750000 },
  { name: "Diğer", value: 410000 },
];

// Renk Paleti (En yüksekten en düşüğe koyulaşan veya sabit bir renk)
const BAR_COLOR = "#ff7a45"; // Turuncu/Kiremit tonu (Arıza/Maliyet çağrışımı için)

const formatCurrency = (value) => {
  if (value >= 1000000) return `₺${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₺${(value / 1000).toFixed(0)}K`;
  return `₺${value}`;
};

function LokasyonBazindaIsTalepleri() {
  // Toplam Tutar Hesaplama (veya statik 4.71M)
  const totalCost = failureCostData.reduce((acc, item) => acc + item.value, 0);
  const highestCategory = failureCostData[0].name; // Veri sıralı varsayılıyor

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "8px 12px",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "600", fontSize: "12px" }}>{label}</p>
          <p style={{ margin: 0, color: BAR_COLOR, fontSize: "12px" }}>
            {`₺${payload[0].value.toLocaleString("tr-TR")}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        gap: "15px",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* --- HEADER --- */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              backgroundColor: "#fff2e8",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertOutlined style={{ color: "#fa541c", fontSize: "16px" }} />
          </div>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontSize: "18px" }}>
            Arıza Nedenleri Maliyetleri
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
          Seçili dönemde arıza kaynaklı maliyet dağılımı (Top 5)
        </Text>
      </div>

      {/* --- CHART CONTENT --- */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={failureCostData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              hide 
              domain={[0, 'dataMax + 100000']} 
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={70} 
              tick={{ fontSize: 12, fill: "#595959" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {failureCostData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLOR} fillOpacity={1 - index * 0.15} /> 
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- FOOTER / STATS --- */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
           <div style={{ display: "flex", gap: "8px", fontSize: "12px" }}>
              <Text type="secondary">Toplam:</Text>
              <Text strong>₺{totalCost.toLocaleString("tr-TR")}</Text>
           </div>
           <div style={{ display: "flex", gap: "8px", fontSize: "12px" }}>
              <Text type="secondary">En yüksek:</Text>
              <Text strong style={{ color: "#fa541c" }}>{highestCategory}</Text>
           </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
            <Text style={{ fontSize: "12px", color: "#1890ff" }}>Bakım / Arıza Detayı</Text>
            <RightCircleOutlined style={{ color: "#1890ff", fontSize: "12px" }} />
        </div>
      </div>
    </div>
  );
}

export default LokasyonBazindaIsTalepleri;