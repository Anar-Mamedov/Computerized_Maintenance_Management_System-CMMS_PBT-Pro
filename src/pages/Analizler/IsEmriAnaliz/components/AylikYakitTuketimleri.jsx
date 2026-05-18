import React, { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spin, Typography, Select, Dropdown, Button } from "antd";
import { MoreOutlined, BarChartOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

const monthMap = {
  January: "Oca",
  February: "Şub",
  March: "Mar",
  April: "Nis",
  May: "May",
  June: "Haz",
  July: "Tem",
  August: "Ağu",
  September: "Eyl",
  October: "Eki",
  November: "Kas",
  December: "Ara",
};

function AylaraGoreIsEmriAnalizi() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metricType, setMetricType] = useState("Sayi"); // Sayi, Sure, Maliyet
  const { watch } = useFormContext();

  const lokasyonId = watch("locationIds");
  const atolyeId = watch("atolyeIds");
  const makineId = watch("makineIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");
  
  // Eğer formdan yıl gelmiyorsa içinde bulunduğumuz yılı default alalım
  const [selectedYil, setSelectedYil] = useState(
    baslangicTarihi ? dayjs(baslangicTarihi).year() : dayjs().year()
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      MakineId: makineId || "",
      BaslangicTarih: baslangicTarihi ? dayjs(baslangicTarihi).format("YYYY-MM-DD") : "",
      BitisTarih: bitisTarihi ? dayjs(bitisTarihi).format("YYYY-MM-DD") : "",
      Yil: selectedYil,
      MetricType: metricType, // Backend'e sayi mi, süre mi, maliyet mi istendiğini geçiyoruz
    };

    try {
      const response = await AxiosInstance.post(`GetAylaraGoreIsEmriAnaliziGraph`, body);
      const formattedData = response.map((item) => ({
        ...item,
        Ay: monthMap[item.Ay] || item.Ay,
        // Backend'den dinamik dönen değeri grafik için tek bir key'e eşitliyoruz
        Deger: item.Deger || 0 
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Grafik verisi çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lokasyonId, atolyeId, makineId, baslangicTarihi, bitisTarihi, selectedYil, metricType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sağ üstteki üç nokta aksiyon menüsü
  const menuItems = [
    { key: "refresh", label: "Verileri Yenile", onClick: fetchData },
    { key: "year", label: "Yıl Seç", onClick: () => {
      const yil = prompt("Lütfen yıl giriniz:", selectedYil);
      if (yil && !isNaN(yil)) setSelectedYil(Number(yil));
    }},
    { key: "download", label: "İndir" },
    { key: "fullscreen", label: "Tam Ekran Aç" },
    { key: "info", label: "Bilgi" },
  ];

  // Barın tepesinde çıkan değerlerin tasarımı (Fotoğraftaki gibi tam ortalı ve net)
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
              Aylara Göre İş Emri Sayıları ({selectedYil})
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
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 25, right: 10, left: -15, bottom: 5 }}>
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
                  "Değer"
                ]} 
              />
              <Bar 
                dataKey="Deger" 
                radius={[6, 6, 0, 0]} // Fotoğraftaki gibi üst köşeleri oval yapmak için
                label={renderCustomBarLabel}
              >
                {data.map((entry, index) => (
                  // Fotoğraftaki o canlı mavi rengi buraya verdik
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