import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Spin, Card, Typography } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

// Özel Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Payload sırası grafikteki render sırasına göre gelir.
    // Veriye doğrudan erişmek için payload[0].payload kullanıyoruz.
    const dataItem = payload[0].payload; 
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: 5 }}>{label}</p>
        <p style={{ color: "#52c41a", margin: 0 }}>
          Arıza Saati: {dataItem.ArizaSaati} sa
        </p>
        <p style={{ color: "#faad14", margin: 0 }}>
          Diğer Duruş: {dataItem.DurusSaati} sa
        </p>
        <p style={{ color: "#00b5ff", fontWeight: "bold", margin: 0 }}>
          Katkı: %{dataItem.KatkiYuzdesi}
        </p>
      </div>
    );
  }
  return null;
};

function ArizaKatkisi() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const { watch } = useFormContext();

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
    MakineIds: Array.isArray(makineIds) ? makineIds : makineIds ? [makineIds] : [],
    LokasyonIds: Array.isArray(lokasyonIds) ? lokasyonIds : lokasyonIds ? [lokasyonIds] : [],
    MakineTipIds: Array.isArray(makineTipIds) ? makineTipIds : makineTipIds ? [makineTipIds] : [],
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.post("GetArizaDurusKatkisiChart", body);
        if (response.Data) {
            setData(response.Data);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [lokasyonIds, makineIds, makineTipIds, baslangicTarihi, bitisTarihi]);

  return (
    <div style={{ width: "100%", height: "100%", padding: "5px" }}>
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
          padding: "15px",
          height: "100%",
          overflow: "hidden",
        }}
        title={<Text strong>Arıza Dağılımı ve Katkısı</Text>}
      >
        {isLoading ? (
          <Spin style={{ margin: "auto" }} />
        ) : (
          <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                
                <XAxis
                  dataKey="Ay"
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                  tickLine={false}
                />

                {/* SOL EKSEN: Saatler (Arıza + Duruş) */}
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'Saat', angle: -90, position: 'insideLeft', style: { fill: '#666', fontSize: '10px' } }}
                />

                {/* SAĞ EKSEN: Yüzde */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                  domain={[0, 'auto']} 
                />

                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />

                {/* 1. Sütun: Arıza Saati (Yeşil) */}
                <Bar
                  yAxisId="left"
                  dataKey="ArizaSaati"
                  name="Arıza Saati"
                  fill="#52c41a"
                  // barSize={20} // Yan yana sığması için barSize'ı biraz küçültebilirsin veya oto bırakabilirsin
                  radius={[4, 4, 0, 0]}
                />

                {/* 2. Sütun: Diğer Duruşlar (Turuncu) - YENİ EKLENEN */}
                <Bar
                  yAxisId="left"
                  dataKey="DurusSaati"
                  name="Diğer Duruş"
                  fill="#faad14"
                  // barSize={20}
                  radius={[4, 4, 0, 0]}
                />

                {/* Çizgi: Katkı % (Mavi) */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="KatkiYuzdesi"
                  name="Katkı (%)"
                  stroke="#00b5ff"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ArizaKatkisi;