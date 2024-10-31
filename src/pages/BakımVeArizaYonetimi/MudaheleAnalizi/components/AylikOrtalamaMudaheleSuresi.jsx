import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Spin, Typography } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import { t } from "i18next";

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
  const [visibleSeries, setVisibleSeries] = useState({
    MaxMudahaleSuresi: true,
    MinMudahaleSuresi: true,
    AvgMudahaleSuresi: true,
  });

  const lokasyonId = watch("locationIds");
  const atolyeId = watch("atolyeIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");
  const makineId = watch("makineIds");
  const yil = baslangicTarihi ? new Date(baslangicTarihi).getFullYear() : "";

  const fetchData = async () => {
    setIsLoading(true);
    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      MakineId: makineId || "",
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
  }, [lokasyonId, atolyeId, makineId, baslangicTarihi, bitisTarihi]);

  // grafikteki serilerin görünürlüğünü değiştirmek için kullanılır

  const handleLegendClick = (dataKey) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const CustomLegend = ({ payload }) => {
    const customNames = {
      MaxMudahaleSuresi: "Max Müdahale Süresi",
      MinMudahaleSuresi: "Min Müdahale Süresi",
      AvgMudahaleSuresi: "Ortalama Müdahale Süresi",
    };

    const handleToggleAll = () => {
      const allVisible = Object.values(visibleSeries).every((value) => value);
      setVisibleSeries({
        MaxMudahaleSuresi: !allVisible,
        MinMudahaleSuresi: !allVisible,
        AvgMudahaleSuresi: !allVisible,
      });
    };

    return (
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          margin: 0,
        }}
      >
        <li
          style={{
            cursor: "pointer",
            color: Object.values(visibleSeries).every((value) => value) ? "black" : "gray",
          }}
          onClick={handleToggleAll}
        >
          Tümü
        </li>
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            style={{
              cursor: "pointer",
              color: visibleSeries[entry.dataKey] ? entry.color : "gray",
            }}
            onClick={() => handleLegendClick(entry.dataKey)}
          >
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                backgroundColor: visibleSeries[entry.dataKey] ? entry.color : "gray",
                marginRight: "5px",
              }}
            ></span>
            {customNames[entry.dataKey] || entry.value}
          </li>
        ))}
      </ul>
    );
  };

  // grafikteki serilerin görünürlüğünü değiştirmek için kullanılır sonu

  // Custom Tooltip iöin kullanılır tool tipte rakamların sonuna birimini yazmak için
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <div className="label">{`Ay: ${label}`}</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} style={{ color: entry.color }}>{`${entry.name}: ${entry.value.toLocaleString("tr-TR")}  (dk.)`}</div>
          ))}
        </div>
      );
    }

    return null;
  };

  // Custom Tooltip iöin kullanılır tool tipte rakamların sonuna birimini yazmak için

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
        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
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
        {t("aylikMudaheleSuresi")} {yil}
      </Text>
      {isLoading ? (
        <Spin />
      ) : (
        <>
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
              <XAxis dataKey="Ay" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {/*<Tooltip />*/}
              <Legend content={<CustomLegend />} />
              <Bar dataKey="MaxMudahaleSuresi" fill="#ff7f7f" hide={!visibleSeries.MaxMudahaleSuresi} name="Max Müdahale Süresi" />
              <Bar dataKey="MinMudahaleSuresi" fill="#82ca9d" hide={!visibleSeries.MinMudahaleSuresi} name="Min Müdahale Süresi" />
              <Bar dataKey="AvgMudahaleSuresi" fill="#8884d8" hide={!visibleSeries.AvgMudahaleSuresi} name="Ortalama Müdahale Süresi" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default AylikOrtalamaMudaheleSuresi;
