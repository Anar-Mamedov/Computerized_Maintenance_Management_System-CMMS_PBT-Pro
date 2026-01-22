import React from "react";
import { Typography } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Text, Title } = Typography;

// Mock Veri: Maliyet Dağılımı (Resimdeki değerlere göre yaklaşık veriler)
const costDistributionData = [
  { name: "Ekskavatör", value: 1250000 },
  { name: "Damper", value: 980000 },
  { name: "Loader", value: 720000 },
  { name: "Backhoe", value: 410000 },
  { name: "Kompresör", value: 85000 },
];

function Component4() {
  
  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
            backgroundColor: "white", 
            padding: "8px 12px", 
            border: "1px solid #f0f0f0", 
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}>
          <p style={{ margin: 0, fontWeight: "600", fontSize: "12px" }}>{label}</p>
          <p style={{ margin: 0, color: "#000000", fontSize: "12px" }}>
            ₺{payload[0].value.toLocaleString("tr-TR")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0", gap: "10px" }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: "10px" }}>
         <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Maliyet Dağılımı (Tip Bazlı)</Title>
      </div>

      {/* CHART */}
      <div style={{ flex: 1, minHeight: "180px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={costDistributionData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            barSize={40} // Barların genişliği
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f0f0f0" />
            
            <XAxis 
                dataKey="name" 
                axisLine={true} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "#595959" }} 
                dy={5}
            />
            
            <YAxis 
                axisLine={true} 
                tickLine={true} 
                tick={{ fontSize: 11, fill: "#595959" }} 
                tickFormatter={(value) => `${(value / 1000)}k`} // Binlik kısaltma
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            
            {/* Siyah Barlar */}
            <Bar 
                dataKey="value" 
                fill="#000000" 
                radius={[4, 4, 0, 0]} // Üst köşeleri hafif yuvarla
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER TIP */}
      <div style={{ marginTop: "10px", paddingTop: "5px" }}>
        <Text type="secondary" style={{ fontSize: "11px", display: "block", color: "#8c8c8c" }}>
            İpucu: Tip bazlı maliyetleri sahaya/aya göre filtreleyip drill-down yapabiliriz.
        </Text>
      </div>

    </div>
  );
}

export default Component4;