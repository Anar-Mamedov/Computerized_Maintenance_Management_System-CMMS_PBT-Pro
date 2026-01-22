import React from "react";
import { Typography } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Text, Title } = Typography;

// Mock Veri
const data = [
  { name: "Açık", value: 57, color: "#3B82F6" },      // Mavi
  { name: "Planlı", value: 32, color: "#10B981" },    // Yeşil
  { name: "Beklemede", value: 18, color: "#F59E0B" }, // Turuncu
  { name: "Kapalı", value: 141, color: "#EC4899" },   // Pembe
];

function Component4() {
  
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0", gap: "10px" }}>
      
      {/* HEADER */}
      <div>
        <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>İş Emirleri Durumu</Title>
        <Text type="secondary" style={{ fontSize: "12px" }}>Açık/Planlı/Beklemede/Kapalı dağılımı</Text>
      </div>

      {/* CHART */}
      <div style={{ flex: 1, minHeight: "180px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER LEGEND (GRID 2x2) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
        {data.map((item) => (
            <div key={item.name} style={{ border: "1px solid #f0f0f0", borderRadius: "8px", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: item.color }}></div>
                        <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>{item.name}</Text>
                    </div>
                    <Text strong style={{ fontSize: "16px", lineHeight: "1" }}>{item.value}</Text>
                </div>
                {/* Opsiyonel: Sağ tarafa mini ikon konabilir */}
            </div>
        ))}
      </div>

    </div>
  );
}

export default Component4;