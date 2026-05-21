import React from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Spin, Typography, Dropdown, Button } from "antd";
import { MoreOutlined, DashboardOutlined } from "@ant-design/icons";

const { Text } = Typography;

function IsEmirleriTrendGrafigi({ aylikTrendler, loading }) {
  // 2026 yılı veya dinamik yıl takibi için (Gerekirse üst component'ten prop olarak da alınabilir)
  const currentYear = new Date().getFullYear();

  // Gelen veriyi (AyAd, AcilanIsEmri, KapananIsEmri) yapısına göre eşliyoruz
  const data = React.useMemo(() => {
    if (!aylikTrendler || !Array.isArray(aylikTrendler)) return [];
    return aylikTrendler.map((item) => ({
      Ay: item.AyAd || "Belirsiz",
      AcilanIsEmri: item.AcilanIsEmri || 0,   // Bar sütun verisi
      KapananIsEmri: item.KapananIsEmri || 0, // Çizgi verisi
    }));
  }, [aylikTrendler]);

  const menuItems = [
    { key: "refresh", label: "Verileri Yenile" },
    { key: "download", label: "İndir" },
    { key: "info", label: "Bilgi" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Üst Başlık Kısmı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DashboardOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              İş Emirleri Trend Grafiği ({currentYear})
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Sütun açılan, çizgi kapanan iş emirlerini gösterir
          </Text>
        </div>

        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>

      {/* Grafik Alanı */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
              {/* Sadece yatay kılavuz çizgileri */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
              
              <XAxis 
                dataKey="Ay" 
                axisLine={{ stroke: "#b5b5b5" }}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 13 }}
              />
              
              <YAxis 
                axisLine={{ stroke: "#b5b5b5" }}
                tickLine={true}
                tick={{ fill: "#666", fontSize: 12 }}
              />
              
              <Tooltip 
                formatter={(value, name) => [`${value} Adet`, name === "AcilanIsEmri" ? "Açılan İş Emri" : "Kapanan İş Emri"]}
              />
              
              <Legend verticalAlign="bottom" height={36} iconType="rect" />
              
              {/* Açılan İş Emri - Mavi Oval Sütunlar */}
              <Bar 
                dataKey="AcilanIsEmri" 
                name="Açılan İş Emri" 
                fill="#1890ff" 
                barSize={50}
                radius={[6, 6, 0, 0]}
              />
              
              {/* Kapanan İş Emri - Yeşil Trend Çizgisi */}
              <Line 
                type="monotone" 
                dataKey="KapananIsEmri" 
                name="Kapanan İş Emri" 
                stroke="#52c41a" 
                strokeWidth={3}
                dot={{ r: 5, stroke: "#52c41a", strokeWidth: 2, fill: "#fff" }} 
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default IsEmirleriTrendGrafigi;