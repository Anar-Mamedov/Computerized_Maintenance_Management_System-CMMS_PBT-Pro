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
  Legend
} from "recharts";

const { Text, Title } = Typography;

// Mock Veri: Resimdeki gibi 3'lü kırılım (Toplam, Yakıt, Bakım)
const costData = [
  { name: "Tem", toplam: 3.8, yakit: 2.0, bakim: 1.6 },
  { name: "Ağu", toplam: 4.2, yakit: 2.1, bakim: 1.7 },
  { name: "Eyl", toplam: 4.5, yakit: 2.2, bakim: 1.8 },
  { name: "Eki", toplam: 4.9, yakit: 2.3, bakim: 1.9 },
  { name: "Kas", toplam: 4.4, yakit: 2.2, bakim: 1.8 },
  { name: "Ara", toplam: 5.1, yakit: 2.4, bakim: 1.9 },
];

function AylikBakimMaliyetleri() {
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "white", padding: "10px", border: "1px solid #f0f0f0", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", marginBottom: "2px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: entry.fill }}></div>
              <span style={{ color: "#595959" }}>{entry.name}:</span>
              <span style={{ fontWeight: "600" }}>₺{(entry.value * 1000000).toLocaleString("tr-TR")}</span>
            </div>
          ))}
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
          <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Operasyon Maliyeti</Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>Aylık toplam maliyet ve ana kırılımlar</Text>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ border: "1px solid #d9d9d9", borderRadius: "4px", padding: "2px 8px", fontSize: "12px", color: "#8c8c8c" }}>Toplam / Yakıt / Bakım</div>
            <div style={{ backgroundColor: "#f0f0f0", borderRadius: "4px", padding: "2px 8px", fontSize: "12px", fontWeight: "600", color: "#595959" }}>Bu Ay</div>
        </div>
      </div>

      {/* CHART */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={costData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8c8c8c" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8c8c8c" }} tickFormatter={(val) => `${val}M`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            {/* Resimdeki renkler: Cyan, Turuncu, Yeşil */}
            <Bar dataKey="toplam" name="Toplam" fill="#00C1DE" radius={[4, 4, 0, 0]} barSize={8} />
            <Bar dataKey="yakit" name="Yakıt" fill="#FAAD14" radius={[4, 4, 0, 0]} barSize={8} />
            <Bar dataKey="bakim" name="Bakım" fill="#00B96B" radius={[4, 4, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER STATS (YAN YANA 3 KUTU) */}
      <div style={{ display: "flex", gap: "15px", borderTop: "1px solid #f0f0f0", paddingTop: "15px" }}>
        
        {/* Kutu 1 */}
        <div style={{ flex: 1, border: "1px solid #f0f0f0", borderRadius: "8px", padding: "10px" }}>
            <Text type="secondary" style={{ fontSize: "11px" }}>Bu Ay Toplam</Text>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#262626", marginTop: "2px" }}>₺4.610.000</div>
            <Text type="secondary" style={{ fontSize: "10px" }}>Tüm şantiyeler</Text>
        </div>

        {/* Kutu 2 */}
        <div style={{ flex: 1, border: "1px solid #f0f0f0", borderRadius: "8px", padding: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FAAD14" }}></div>
                <Text type="secondary" style={{ fontSize: "11px" }}>Yakıt</Text>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#262626", marginTop: "2px" }}>₺2.020.000</div>
            <Text type="secondary" style={{ fontSize: "10px" }}>Aktarılan + manuel</Text>
        </div>

        {/* Kutu 3 */}
        <div style={{ flex: 1, border: "1px solid #f0f0f0", borderRadius: "8px", padding: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00B96B" }}></div>
                <Text type="secondary" style={{ fontSize: "11px" }}>Bakım/Onarım</Text>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#262626", marginTop: "2px" }}>₺1.640.000</div>
            <Text type="secondary" style={{ fontSize: "10px" }}>İş emri maliyetleri</Text>
        </div>

      </div>
    </div>
  );
}

export default AylikBakimMaliyetleri;