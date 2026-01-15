import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spin, Typography, Card } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text, Title } = Typography;

function MudaheleSuresiHistogram() {
  const [isLoading, setIsLoading] = useState(true);
  const { watch } = useFormContext();

  // Varsayılan değerler
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
    MakineIds: Array.isArray(makineIds)
      ? makineIds
      : makineIds
      ? [makineIds]
      : [],
    LokasyonIds: Array.isArray(lokasyonIds)
      ? lokasyonIds
      : lokasyonIds
      ? [lokasyonIds]
      : [],
    MakineTipIds: Array.isArray(makineTipIds)
      ? makineTipIds
      : makineTipIds
      ? [makineTipIds]
      : [],
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cardResponse, chartResponse] = await Promise.all([
        AxiosInstance.post("GetMttrCard", body),
        AxiosInstance.post("GetMttrChart", body),
      ]);

      if (cardResponse) setCardData(cardResponse);
      if (chartResponse && chartResponse.Data) setChartData(chartResponse.Data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonIds, makineIds, makineTipIds, baslangicTarihi, bitisTarihi]);

  // --- RENK VE İŞARET MANTIĞI ---
  const trendValue = cardData?.Trend ?? 0;
  
  // MTTR Mantığı: Süre düşerse (Negatif) İYİ (Yeşil), artarsa (Pozitif) KÖTÜ (Kırmızı)
  const isGoodTrend = trendValue < 0; 
  const trendColor = isGoodTrend ? "#52c41a" : "#f5222d"; 
  
  // Eğer pozitifse başına + koy, negatifse zaten veriden - gelir.
  const trendSign = trendValue > 0 ? "+" : "";

  return (
    <div style={{ width: "100%", height: "100%", padding: "5px" }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Card
          style={{
            borderRadius: "16px",
            height: "100%",
            border: "1px solid #f0f0f0",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          bodyStyle={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            height: "100%",
            overflow: "hidden",
          }}
          title={
            <div>
              <Text strong style={{ fontSize: "16px" }}>
                MTTR
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 10 }}>
                Ortalama Onarım Süresi • Formül: Toplam Onarım Süresi / Onarım Sayısı
              </Text>
            </div>
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "16px",
              flexShrink: 0,
            }}
          >
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {cardData?.Value}{" "}
                <small style={{ fontSize: 14 }}>{cardData?.Unit}</small>
              </Title>
              {/* Trend Kısmı */}
              <Text
                style={{
                  color: trendColor,
                  fontSize: 14, // Biraz büyüttüm daha net görünsün
                  fontWeight: "bold",
                }}
              >
                {trendSign}{trendValue}% Önceki Döneme Göre
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 11 }}>
              Dönem: {dayjs().format("YYYY")}
            </Text>
          </div>

          <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="Etiket" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="Deger"
                  stroke="#27ae60"
                  dot={{ r: 4 }}
                  strokeWidth={2}
                  name="MTTR"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}

export default MudaheleSuresiHistogram;