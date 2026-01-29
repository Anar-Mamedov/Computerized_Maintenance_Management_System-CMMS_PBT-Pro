import React, { useMemo } from "react";
import { Typography } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Text, Title } = Typography;

// Mock Grafik Verisi (Aylık Dağılım)
const chartData = [
  { name: "Oca", Yakıt: 4.2, Bakım: 1.8, Parça: 1.5, Taşeron: 1.1, Diğer: 0.6 },
  { name: "Şub", Yakıt: 4.1, Bakım: 1.7, Parça: 1.4, Taşeron: 1.0, Diğer: 0.5 },
  { name: "Mar", Yakıt: 4.3, Bakım: 1.9, Parça: 1.6, Taşeron: 1.2, Diğer: 0.7 },
  { name: "Nis", Yakıt: 4.0, Bakım: 1.6, Parça: 1.3, Taşeron: 1.1, Diğer: 0.6 },
  { name: "May", Yakıt: 4.5, Bakım: 2.0, Parça: 1.7, Taşeron: 1.3, Diğer: 0.8 },
  { name: "Haz", Yakıt: 4.8, Bakım: 2.1, Parça: 1.8, Taşeron: 1.4, Diğer: 0.9 },
  { name: "Tem", Yakıt: 5.0, Bakım: 2.2, Parça: 1.9, Taşeron: 1.5, Diğer: 1.0 }, // Yazın artış
  { name: "Ağu", Yakıt: 4.9, Bakım: 2.1, Parça: 1.8, Taşeron: 1.4, Diğer: 0.8 },
  { name: "Eyl", Yakıt: 4.4, Bakım: 1.8, Parça: 1.5, Taşeron: 1.1, Diğer: 0.6 },
  { name: "Eki", Yakıt: 4.1, Bakım: 1.7, Parça: 1.4, Taşeron: 1.0, Diğer: 0.5 },
  { name: "Kas", Yakıt: 3.9, Bakım: 1.5, Parça: 1.2, Taşeron: 0.9, Diğer: 0.4 },
  { name: "Ara", Yakıt: 3.8, Bakım: 1.4, Parça: 1.1, Taşeron: 0.8, Diğer: 0.3 },
];

// Sol Taraf İstatistik Verileri
const stats = [
  { label: "Yakıt", value: "₺50.200.000", color: "#8884d8" },
  { label: "Bakım", value: "₺21.200.000", color: "#82ca9d" },
  { label: "Parça", value: "₺17.700.000", color: "#ffc658" },
  { label: "Taşeron", value: "₺13.100.000", color: "#ff8042" },
  { label: "Diğer", value: "₺7.300.000", color: "#0088FE" },
];

const Component5 = () => {
  // Para birimi formatlayıcı (Tooltip için)
  const currencyFormatter = (value) => {
    return `₺${(value * 1000000).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
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
      }}
    >
      {/* HEADER KISMI */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={4} style={{ margin: 0, color: "#1f1f1f" }}>
              Yıllık Maliyet Grafiği
            </Title>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Aylara göre maliyet dağılımı (Yakıt/Bakım/Parça/Taşeron/Diğer)
            </Text>
          </div>
          <div
            style={{
              backgroundColor: "#f0f2f5",
              padding: "4px 12px",
              borderRadius: "6px",
              fontWeight: "600",
              color: "#595959",
            }}
          >
            2025
          </div>
        </div>
      </div>

      {/* İÇERİK KISMI (SOL: ÖZET, SAĞ: GRAFİK) */}
      <div style={{ display: "flex", flex: 1, gap: "20px", minHeight: 0 }}>
        
        {/* SOL: TOPLAM VE DETAYLAR */}
        
        <div style={{ width: "220px", display: "flex", flexDirection: "column", gap: "15px", overflowY: "auto" }}>
          {/* Genel Toplam Kartı */}
          <div style={{ padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px", borderLeft: "4px solid #1890ff" }}>
            <Text style={{ display: "block", color: "#8c8c8c", fontSize: "12px" }}>TOPLAM MALİYET</Text>
            <Text style={{ display: "block", fontSize: "24px", fontWeight: "700", color: "#262626" }}>
              ₺109.500.000
            </Text>
          </div>

          {/* Alt Kırılımlar Listesi */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: stat.color }}></div>
                  <Text style={{ color: "#595959" }}>{stat.label}</Text>
                </div>
                <Text strong>{stat.value}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ: GRAFİK ALANI */}
        <div style={{ flex: 1, minHeight: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#8c8c8c", fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#8c8c8c", fontSize: 12 }} 
                tickFormatter={(value) => `${value}M`} 
              />
              <Tooltip 
                cursor={{ fill: "rgba(0,0,0,0.02)" }}
                formatter={(value) => [currencyFormatter(value), ""]}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              
              {/* Stacked Barlar */}
              <Bar dataKey="Yakıt" stackId="a" fill="#8884d8" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Bakım" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Parça" stackId="a" fill="#ffc658" />
              <Bar dataKey="Taşeron" stackId="a" fill="#ff8042" />
              <Bar dataKey="Diğer" stackId="a" fill="#0088FE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div style={{ marginTop: "10px", textAlign: "right" }}>
        <Text type="secondary" style={{ fontSize: "11px", fontStyle: "italic" }}>
          * Not: Grafik mock veridir. Gerçekte maliyet kayıtlarından aylık toplamlar ile beslenir.
        </Text>
      </div>
    </div>
  );
};

export default Component5;