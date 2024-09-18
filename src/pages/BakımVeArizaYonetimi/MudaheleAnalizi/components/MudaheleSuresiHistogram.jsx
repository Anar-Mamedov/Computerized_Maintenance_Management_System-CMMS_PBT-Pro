import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Spin, Typography } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";

const { Text } = Typography;

function MudaheleSuresiHistogram() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { watch } = useFormContext();

  const lokasyonId = watch("locationIds");
  const atolyeId = watch("atolyeIds");
  const makineId = watch("makineIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");

  const fetchData = async () => {
    setIsLoading(true);
    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      MakineId: makineId || "",
      BaslangicTarih: baslangicTarihi || "",
      BitisTarih: bitisTarihi || "",
    };
    try {
      const response = await AxiosInstance.post(`GetMudahaleAnalizHistogramGraph`, body);
      setData(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonId, atolyeId, makineId, baslangicTarihi, bitisTarihi]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "5px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #f0f0f0",
        padding: "10px",
      }}
    >
      <Text
        style={{
          fontWeight: "500",
          fontSize: "17px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          marginBottom: "10px",
        }}
      >
        Müdahale Süresi Histogramı
      </Text>
      {isLoading ? (
        <Spin />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="MudaheleSuresiAraligi" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="TalepSayi" fill="#8884d8" name="Talep Sayısı" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default MudaheleSuresiHistogram;
