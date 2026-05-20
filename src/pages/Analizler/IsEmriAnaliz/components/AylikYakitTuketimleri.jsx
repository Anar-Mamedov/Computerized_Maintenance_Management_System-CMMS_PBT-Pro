import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spin, Typography, Select, Dropdown, Button } from "antd";
import { MoreOutlined, BarChartOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Ana ekrandan aylikTrendler listesini ve loading durumunu prop olarak alıyoruz kanka
function AylaraGoreIsEmriAnalizi({ aylikTrendler, loading }) {
  const [metricType, setMetricType] = useState("Sayi"); // Sayi, Sure, Maliyet

  // Kullanıcının seçtiği filtreye göre veriyi anlık olarak grafiğin beklediği formata mapliyoruz
  const chartData = useMemo(() => {
    if (!aylikTrendler || !Array.isArray(aylikTrendler)) return [];

    return aylikTrendler.map((item) => {
      let grafikDegeri = 0;

      // Seçilen metriğe göre objeden doğru veriyi çekiyoruz kanka
      if (metricType === "Sayi") {
        grafikDegeri = item.AcilanIsEmri || 0;
      } else if (metricType === "Sure") {
        grafikDegeri = item.ToplamSureSaat || 0;
      } else if (metricType === "Maliyet") {
        grafikDegeri = item.ToplamMaliyet || 0;
      }

      return {
        Ay: item.AyAd, // Backend'den gelen "Oca", "Şub" vb. doğrudan kullanılıyor
        Deger: grafikDegeri,
      };
    });
  }, [aylikTrendler, metricType]);

  // Sağ üstteki üç nokta aksiyon menüsü
  const menuItems = [
    { key: "download", label: "İndir" },
    { key: "fullscreen", label: "Tam Ekran Aç" },
    { key: "info", label: "Bilgi" },
  ];

  // Barın tepesinde çıkan değerlerin tasarımı (Tam ortalı ve metrik tipine uygun formatta)
  const renderCustomBarLabel = ({ x, y, width, value }) => {
    return (
      <text 
        x={x + width / 2} 
        y={y - 8} 
        fill="#555" 
        textAnchor="middle" 
        dominantBaseline="bottom"
        style={{ fontSize: "13px", fontWeight: "500" }}
      >
        {metricType === "Maliyet" ? `₺${value.toLocaleString("tr-TR")}` : value}
      </text>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "420px",
        borderRadius: "10px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Üst Başlık ve Seçim Alanı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BarChartOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              Aylara Göre İş Emri Analizi
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Aylık iş emri sayısı, süresi veya maliyeti
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Select
            value={metricType}
            onChange={(value) => setMetricType(value)}
            style={{ width: 140 }}
            size="small"
            options={[
              { value: "Sayi", label: "İş Emri Sayısı" },
              { value: "Sure", label: "İş Emri Süresi" },
              { value: "Maliyet", label: "İş Emri Maliyeti" },
            ]}
          />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Grafik Çizim Alanı */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 25, right: 10, left: -15, bottom: 5 }}>
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
                formatter={(value) => [
                  metricType === "Maliyet" ? `₺${value.toLocaleString("tr-TR")}` : `${value}`, 
                  metricType === "Sayi" ? "İş Emri Sayısı" : metricType === "Sure" ? "Toplam Süre (Saat)" : "Toplam Maliyet"
                ]} 
              />
              <Bar 
                dataKey="Deger" 
                radius={[6, 6, 0, 0]} 
                label={renderCustomBarLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#1890ff" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default AylaraGoreIsEmriAnalizi;