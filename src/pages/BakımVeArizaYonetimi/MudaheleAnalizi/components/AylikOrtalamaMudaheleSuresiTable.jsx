import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Spin, Typography, Table } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";

const { Text } = Typography;

const monthMap = {
  January: "Ocak",
  February: "Şubat",
  March: "Mart",
  April: "Nisan",
  May: "Mayıs",
  June: "Haziran",
  July: "Temmuz",
  August: "Ağustos",
  September: "Eylül",
  October: "Ekim",
  November: "Kasım",
  December: "Aralık",
};

function AylikOrtalamaMudaheleSuresi() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { watch } = useFormContext();

  const lokasyonId = watch("locationIds");
  const atolyeId = watch("atolyeIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");
  const yil = baslangicTarihi ? new Date(baslangicTarihi).getFullYear() : "";

  const fetchData = async () => {
    setIsLoading(true);
    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      BaslangicTarih: baslangicTarihi || "",
      BitisTarih: bitisTarihi || "",
      Yil: yil || "",
    };
    try {
      const response = await AxiosInstance.post(`GetMudahaleAnalizAvgMudahaleGraph`, body);
      const translatedData = response.map((item) => ({
        ...item,
        Ay: monthMap[item.Ay], // Ay'ları Türkçeye çeviriyoruz
      }));
      setData(translatedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonId, atolyeId, baslangicTarihi, bitisTarihi]);

  const columns = [
    {
      title: "",
      dataIndex: "type",
      key: "type",
    },
    ...(data?.map((item) => ({
      title: item.Ay,
      dataIndex: item.Ay,
      key: item.Ay,
    })) || []),
  ];

  const dataSource = [
    {
      key: "avg",
      type: "Ortalama (dk.)",
      ...(data?.reduce((acc, item) => {
        acc[item.Ay] = item.AvgMudahaleSuresi;
        return acc;
      }, {}) || {}),
    },
    {
      key: "min",
      type: "Min (dk.)",
      ...(data?.reduce((acc, item) => {
        acc[item.Ay] = item.MinMudahaleSuresi;
        return acc;
      }, {}) || {}),
    },
    {
      key: "max",
      type: "Max (dk.)",
      ...(data?.reduce((acc, item) => {
        acc[item.Ay] = item.MaxMudahaleSuresi;
        return acc;
      }, {}) || {}),
    },
  ];

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
        }}
      >
        Aylık Müdahale Süreleri Tablosu {yil}
      </Text>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          {/*<ResponsiveContainer width="100%" height={400}>*/}
          {/*  <BarChart*/}
          {/*    width={500}*/}
          {/*    height={300}*/}
          {/*    data={data}*/}
          {/*    margin={{*/}
          {/*      top: 20,*/}
          {/*      right: 30,*/}
          {/*      left: 20,*/}
          {/*      bottom: 5,*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <CartesianGrid strokeDasharray="3 3" />*/}
          {/*    <XAxis dataKey="Ay" />*/}
          {/*    <YAxis />*/}
          {/*    <Tooltip />*/}
          {/*    <Legend />*/}
          {/*    <Bar dataKey="MaxMudahaleSuresi" fill="#ff7f7f" name="Max Müdahale Süresi" />*/}
          {/*    <Bar dataKey="MinMudahaleSuresi" fill="#82ca9d" name="Min Müdahale Süresi" />*/}
          {/*    <Bar dataKey="AvgMudahaleSuresi" fill="#8884d8" name="Ortalama Müdahale Süresi" />*/}
          {/*  </BarChart>*/}
          {/*</ResponsiveContainer>*/}
          <Table columns={columns} dataSource={dataSource} pagination={false} size="small" bordered />
        </>
      )}
    </div>
  );
}

export default AylikOrtalamaMudaheleSuresi;
