import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Spin, Card, Typography } from "antd";
import AxiosInstance from "../../../../../api/http";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

function TamamlananPlanlananBakim() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
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
    MakineIds: Array.isArray(makineIds) ? makineIds : (makineIds ? [makineIds] : []),
    LokasyonIds: Array.isArray(lokasyonIds) ? lokasyonIds : (lokasyonIds ? [lokasyonIds] : []),
    MakineTipIds: Array.isArray(makineTipIds) ? makineTipIds : (makineTipIds ? [makineTipIds] : []),
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.post("GetTamamlananPlanlananBakim", body);
        if (response.Data) setData(response.Data);
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [lokasyonIds, makineIds, makineTipIds, baslangicTarihi, bitisTarihi]);

  const chartData = data
    ? [
        { name: "Tamamlanan", value: data.TamamlanmaOrani || 0, color: "#52c41a" },
        { name: "Kalan", value: 100 - (data.TamamlanmaOrani || 0), color: "#f0f0f0" },
      ]
    : [];

  const StatCard = ({ title, value, bgColor }) => (
    <div style={{ backgroundColor: bgColor, borderRadius: "8px", padding: "8px", marginBottom: "6px", flex: 1 }}>
      <Text type="secondary" style={{ fontSize: "10px", display: "block" }}>{title}</Text>
      <Text strong style={{ fontSize: "16px" }}>{value}</Text>
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%", padding: "5px" }}>
      <Card
        style={{ borderRadius: "16px", height: "100%", border: "1px solid #f0f0f0", display: "flex", flexDirection: "column", overflow: "hidden" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", padding: "15px", height: "100%", overflow: "hidden" }}
        title={<Text strong>Tamamlanan / Planlanan Bakım</Text>}
      >
        {isLoading ? (
          <Spin style={{ margin: "auto" }} />
        ) : (
          <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center" }}>
            <div style={{ flex: 1, height: "100%", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="85%"
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `%${val.toFixed(1)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "10px" }}>
               <StatCard title="Tamamlanan" value={data?.Tamamlanan} bgColor="#f6ffed" />
               <StatCard title="Planlanan" value={data?.Planlanan} bgColor="#fafafa" />
               <StatCard title="Geciken" value={data?.Geciken} bgColor="#fff1f0" />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default TamamlananPlanlananBakim;