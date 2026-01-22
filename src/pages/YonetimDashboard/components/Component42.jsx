import React from "react";
import { Typography } from "antd";
import { LineChartOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Text, Title } = Typography;

// Mock Veri: Kullanılabilirlik Trend (Resimdeki yaklaşık değerler)
const availabilityData = [
  { name: "Tem", value: 91 },
  { name: "Ağu", value: 90 },
  { name: "Eyl", value: 92 },
  { name: "Eki", value: 89 },
  { name: "Kas", value: 93 },
  { name: "Ara", value: 92 },
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
          <p style={{ margin: 0, color: "#1890ff", fontSize: "12px" }}>
            %{payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0", gap: "10px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
         {/* İsteğe bağlı ikon, resimde yok ama şık durur */}
         {/* <LineChartOutlined style={{ fontSize: "18px", color: "#1890ff" }} /> */}
         <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Kullanılabilirlik Trend (6 Ay)</Title>
      </div>

      {/* CHART */}
      <div style={{ flex: 1, minHeight: "160px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={availabilityData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f0f0f0" />
            
            <XAxis 
                dataKey="name" 
                axisLine={true} 
                tickLine={true} 
                tick={{ fontSize: 11, fill: "#8c8c8c" }} 
                dy={5}
            />
            
            <YAxis 
                domain={[80, 100]} // Resimdeki gibi 80-100 aralığı
                axisLine={true} 
                tickLine={true} 
                tick={{ fontSize: 11, fill: "#8c8c8c" }} 
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#1890ff", strokeWidth: 1, strokeDasharray: "4 4" }} />
            
            <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#1890ff" 
                strokeWidth={3}
                dot={{ r: 4, fill: "white", stroke: "#1890ff", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER NOTE */}
      <div style={{ marginTop: "10px", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
        <Text type="secondary" style={{ fontSize: "11px", fontStyle: "italic", display: "block", lineHeight: "1.4" }}>
            Not: Kullanılabilirlik = (Toplam süre – planlı/arıza duruş) / toplam süre
        </Text>
      </div>

    </div>
  );
}

export default Component4;