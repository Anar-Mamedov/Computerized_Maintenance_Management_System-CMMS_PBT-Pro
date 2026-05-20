import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Spin, Typography, Radio, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Grafik Renk Paleti
const COLORS = ["#007bff", "#ff4d4f", "#ffc107", "#17a2b8", "#28a745", "#a463bf", "#6f42c1"];

// Ana ekrandan tipDagilimi verisini ve loading durumunu prop olarak alıyoruz kanka
function IsEmriDagilimGrafigi({ tipDagilimi, loading }) {

  // Gelen ham API verisini Recharts'ın anlayacağı 'name', 'value' ve 'percentage' formatına mapliyoruz
  const chartData = React.useMemo(() => {
    if (!tipDagilimi || !Array.isArray(tipDagilimi)) return [];
    return tipDagilimi.map((item) => ({
      name: item.TipAdi,        // örn: "PERİYODİK BAKIM"
      value: item.Adet,          // örn: 3127
      percentage: item.Yuzde,    // örn: 52.9
    }));
  }, [tipDagilimi]);

  // Sağ üstteki üç nokta menüsü
  const menuItems = [
    { key: "1", label: "Verileri Yenile" },
    { key: "2", label: "İndir" },
    { key: "3", label: "Tam Ekran Aç" },
    { key: "4", label: "Bilgi" },
  ];

  // Özel Label Çizimi ("PERİYODİK BAKIM: 3127 (%52.9)" yazıları için)
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="#666" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" style={{ fontSize: "12px" }}>
        {`${name}: ${value} (%${percentage})`}
      </text>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "10px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header Kısmı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "16px", height: "16px", backgroundColor: "#333", borderRadius: "3px" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>İş Emri Dağılım Grafiği</Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Durum veya tip seçimine göre pasta grafik
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Şu an sadece Tip listesi geldiği için default olarak Tip aktif duruyor */}
          <Radio.Group value="Tip" size="small" buttonStyle="solid">
            <Radio.Button value="Tip">Tip</Radio.Button>
            <Radio.Button value="Durum">Durum</Radio.Button>
          </Radio.Group>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Grafik Alanı */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} Adet (%${props.payload.percentage})`, name]} />
              <Legend verticalAlign="bottom" iconType="rect" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default IsEmriDagilimGrafigi;