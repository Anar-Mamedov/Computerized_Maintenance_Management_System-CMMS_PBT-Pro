import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spin, Card, Typography } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

function ArizaDurumu() {
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
    MakineIds: Array.isArray(makineIds) ? makineIds : (makineIds ? [makineIds] : []),
    LokasyonIds: Array.isArray(lokasyonIds) ? lokasyonIds : (lokasyonIds ? [lokasyonIds] : []),
    MakineTipIds: Array.isArray(makineTipIds) ? makineTipIds : (makineTipIds ? [makineTipIds] : []),
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.post("GetArizaSayisiAylikChart", body);
        if (response.Data) setData(response.Data);
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
        style={{ borderRadius: "16px", height: "100%", border: "1px solid #f0f0f0", display: "flex", flexDirection: "column", overflow: "hidden" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", padding: "15px", height: "100%", overflow: "hidden" }}
        title={<Text strong>Arıza Durumu (Aylık Trend)</Text>}
      >
        {isLoading ? (
          <Spin style={{ margin: "auto" }} />
        ) : (
          <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="Ay" tick={{ fontSize: 11 }} axisLine={{ stroke: "#e0e0e0" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="Sayi" name="Arıza Sayısı" fill="#00b5ff" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ArizaDurumu;