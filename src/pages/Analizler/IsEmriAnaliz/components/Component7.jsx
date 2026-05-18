import React, { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Spin, Typography, Radio, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

// Grafik Renk Paleti (Fotoğraftakine benzer)
const COLORS = ["#007bff", "#ff4d4f", "#ffc107", "#17a2b8", "#28a745"];

function IsEmriDagilimGrafigi() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Tip"); // 'Tip' veya 'Durum'
  const { watch } = useFormContext();

  const filters = watch(); // Formdaki tüm filtreleri izle

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const body = {
      LokasyonId: filters.locationIds || "",
      AtolyeId: filters.atolyeIds || "",
      MakineId: filters.makineIds || "",
      BaslangicTarih: filters.baslangicTarihi ? dayjs(filters.baslangicTarihi).format("YYYY-MM-DD") : "",
      BitisTarih: filters.bitisTarihi ? dayjs(filters.bitisTarihi).format("YYYY-MM-DD") : "",
      TabType: activeTab, // Backend'e hangi kırılımın istendiğini gönderiyoruz
    };

    try {
      const response = await AxiosInstance.post(``, body);
      // Gelen veriyi PieChart'ın anlayacağı 'name' ve 'value' formatına mapliyoruz
      const formattedData = response.map((item) => ({
        name: item.Etiket, // örn: "Arıza", "Bakım"
        value: item.Adet,   // örn: 647
        percentage: item.Yuzde, // örn: 41.4
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Grafik verisi çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sağ üstteki üç nokta menüsü
  const menuItems = [
    { key: "1", label: "Verileri Yenile", onClick: fetchData },
    { key: "2", label: "İndir" },
    { key: "3", label: "Tam Ekran Aç" },
    { key: "4", label: "Bilgi" },
  ];

  // Özel Label Çizimi (Fotoğraftaki "Arıza: 647 (41.4%)" yazıları için)
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
        height: "400px", // İhtiyaca göre ayarlanabilir
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
            <div style={{ width: "16px", height: "16px", backgroundColor: "#333", borderRadius: "3px" }} /> {/* Küçük ikon simgesi */}
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>İş Emri Dağılım Grafiği</Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Durum veya tip seçimine göre pasta grafik
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Radio.Group value={activeTab} onChange={(e) => setActiveTab(e.target.value)} size="small" buttonStyle="solid">
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
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70} // Donut görünümü için
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
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