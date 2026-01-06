import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Spin, Typography, Card, Button } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text, Title } = Typography;

function Mtbf() {
  const [isLoading, setIsLoading] = useState(true);
  const { watch } = useFormContext();

  const [cardData, setCardData] = useState({ Value: 0, Unit: "", Trend: 0 });
  const [chartData, setChartData] = useState([]);

  const lokasyonIds = watch("locationIds");
  const makineIds = watch("makineIds");
  const makineTipIds = watch("makineTipIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");

  const body = {
    StartDate: baslangicTarihi 
      ? dayjs(baslangicTarihi).format("YYYY-MM-DD") 
      : dayjs().subtract(1, "year").format("YYYY-MM-DD"),
    EndDate: bitisTarihi 
      ? dayjs(bitisTarihi).format("YYYY-MM-DD") 
      : dayjs().format("YYYY-MM-DD"),
    MakineIds: Array.isArray(makineIds) ? makineIds : (makineIds ? [makineIds] : []),
    LokasyonIds: Array.isArray(lokasyonIds) ? lokasyonIds : (lokasyonIds ? [lokasyonIds] : []),
    MakineTipIds: Array.isArray(makineTipIds) ? makineTipIds : (makineTipIds ? [makineTipIds] : []),
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cardResponse, chartResponse] = await Promise.all([
        AxiosInstance.post("GetMtbfCard", body),
        AxiosInstance.post("GetMtbfChart", body),
      ]);

      if (cardResponse) setCardData(cardResponse);
      if (chartResponse && chartResponse.Data) setChartData(chartResponse.Data);
    } catch (error) {
      console.error("Failed to fetch MTBF data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonIds, makineIds, makineTipIds, baslangicTarihi, bitisTarihi]);

  const cardStyle = {
    borderRadius: "16px",
    height: "100%",
    border: "1px solid #f0f0f0",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    overflow: "hidden", 
  };

  const trendColor = "#f5222d";
  const trendSign = cardData?.Trend > 0 ? "+" : "";

  return (
    <div style={{ width: "100%", height: "100%", padding: "5px" }}>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Card
          style={cardStyle}
          bodyStyle={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            padding: "20px",
            height: "100%",
            overflow: "hidden" 
          }}
          title={
            <div>
              <Text strong style={{ fontSize: "16px" }}>MTBF</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 11 }}>
                Arızalar Arası Ortalama Süre • Formül: Toplam Çalışma Süresi / Toplam Arıza Sayısı
              </Text>
            </div>
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
              marginTop: "10px",
              flexShrink: 0 
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                <span style={{ fontSize: "38px", fontWeight: "bold", color: "#333" }}>
                    {cardData?.Value}
                </span>
                <span style={{ fontSize: "20px", color: "#333", fontWeight: "500" }}>
                    {cardData?.Unit}
                </span>
              </div>
              <Text style={{ color: trendColor, fontSize: 13, fontWeight: "500" }}>
                {trendSign}%{cardData?.Trend} Önceki Döneme Göre
              </Text>
            </div>
            <div style={{ marginTop: "auto", marginBottom: "5px" }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Filtre: {lokasyonIds ? "Seçili Lokasyon" : "İstanbul"}
                </Text>
            </div>
          </div>
          <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="Etiket" tick={{ fontSize: 12, fill: "#666" }} axisLine={{ stroke: "#e0e0e0" }} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => [`${value} Saat`, "MTBF"]} />
                <Bar dataKey="Deger" name="MTBF" barSize={50} fill="#00b5ff">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#00b5ff" />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Mtbf;