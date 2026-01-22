import React from "react";
import { Typography } from "antd";
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

// Mock Veri: Son 7 gün çalışma saatleri ve üretim skoru
const operationTrendData = [
  { day: "Pzt", hours: 610, score: 92 },
  { day: "Sal", hours: 650, score: 88 },
  { day: "Çar", hours: 700, score: 96 },
  { day: "Per", hours: 680, score: 94 },
  { day: "Cum", hours: 740, score: 98 },
  { day: "Cmt", hours: 580, score: 85 },
  { day: "Paz", hours: 530, score: 80 },
];

function AylikBakimMaliyetleri() { // Dosya ismini bozmadım, "Operasyon Trendleri" olarak içerik değişti
  
  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "white", padding: "10px", border: "1px solid #f0f0f0", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{label}</p>
          <div style={{ fontSize: "12px", color: "#1890ff", marginBottom: "2px" }}>
             Çalışma Saati: <b>{payload[0].value}</b>
          </div>
          <div style={{ fontSize: "12px", color: "#722ed1" }}>
             Üretim Skoru: <b>{payload[1].value}</b>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0", gap: "20px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Operasyon Trendleri</Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>Son 7 gün çalışma saatleri ve üretim skoru (örnek veri)</Text>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ border: "1px solid #d9d9d9", borderRadius: "16px", padding: "2px 10px", fontSize: "11px", color: "#595959" }}>Çalışma Saati</div>
            <div style={{ border: "1px solid #d9d9d9", borderRadius: "16px", padding: "2px 10px", fontSize: "11px", color: "#595959" }}>Üretim Skoru</div>
        </div>
      </div>

      {/* CHART */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={operationTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            
            <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "#8c8c8c" }} 
                dy={10} 
            />
            
            {/* Sol Y Ekseni (Çalışma Saati) */}
            <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "#8c8c8c" }} 
                domain={[0, 800]}
                ticks={[0, 200, 400, 600, 800]}
            />
            
            {/* Sağ Y Ekseni (Üretim Skoru) */}
            <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "#8c8c8c" }} 
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
            />

            <Tooltip content={<CustomTooltip />} />
            
            {/* Çizgiler */}
            <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="hours" 
                stroke="#1890ff" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4 }}
            />
            <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="score" 
                stroke="#722ed1" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER STATS (YAN YANA 3 KUTU) */}
      <div style={{ display: "flex", gap: "15px" }}>
        
        {/* Kutu 1 */}
        <div style={{ flex: 1, border: "1px solid #f0f0f0", borderRadius: "12px", padding: "12px" }}>
            <Text type="secondary" style={{ fontSize: "11px" }}>Bugün Çalışma Saati</Text>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#262626", marginTop: "4px" }}>
                742 <span style={{ fontSize: "14px", fontWeight: "400" }}>saat</span>
            </div>
        </div>

        {/* Kutu 2 */}
        <div style={{ flex: 1, border: "1px solid #f0f0f0", borderRadius: "12px", padding: "12px" }}>
            <Text type="secondary" style={{ fontSize: "11px" }}>Üretim Skoru (Ort.)</Text>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#262626", marginTop: "4px" }}>92</div>
        </div>

        {/* Kutu 3 */}
        <div style={{ flex: 1, border: "1px solid #f0f0f0", borderRadius: "12px", padding: "12px" }}>
            <Text type="secondary" style={{ fontSize: "11px" }}>Duruş Etkisi (Tahmini)</Text>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#262626", marginTop: "4px" }}>₺310.000</div>
        </div>

      </div>
    </div>
  );
}

export default AylikBakimMaliyetleri;