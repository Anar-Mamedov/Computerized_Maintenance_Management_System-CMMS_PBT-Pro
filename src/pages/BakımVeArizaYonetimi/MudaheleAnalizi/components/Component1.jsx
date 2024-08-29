import React, { useState, useEffect } from "react";
import bg from "../../../../assets/images/bg-card.png";
import { Spin, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

function Component1() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const { watch } = useFormContext();

  const lokasyonId = watch("locationIds");
  const atolyeId = watch("atolyeIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");

  const fetchData = async () => {
    setIsLoading(true);
    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      BaslangicTarih: baslangicTarihi || "",
      BitisTarih: bitisTarihi || "",
    };
    try {
      const response = await AxiosInstance.post(`GetMudahaleAnalizDashboard`, body);
      setData(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonId, atolyeId, baslangicTarihi, bitisTarihi]);

  const renderCard = (value, label, backgroundColor) => (
    <div
      style={{
        flex: "1 1 calc(16.66% - 10px)",
        maxWidth: "calc(16.66% - 10px)",
        background: backgroundColor || `url(${bg}), linear-gradient(rgb(27 17 92), #007eff)`,
        backgroundPosition: "inherit",
        backgroundSize: "cover",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "0px",
      }}
    >
      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <Spin size="large" style={{ color: "#fff" }} />
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ fontWeight: "500", fontSize: "35px", color: "white" }}>{value !== undefined ? value : ""}</Text>
            <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>{label}</Text>
          </div>
          {/*<ClockCircleOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />*/}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {renderCard(data?.ToplamTalepSayisi, "Toplam Talep Sayısı", "linear-gradient(to right, #ff7e5f, #feb47b)")}
      {renderCard(data?.OrtalamaMudahaleSuresi, "Ortalama Müdahale Süresi", "linear-gradient(to right, #6a11cb, #2575fc)")}
      {renderCard(data?.EnHizliMudahaleSuresi, "En Hızlı Müdahale Süresi", "linear-gradient(to right, #43cea2, #185a9d)")}
      {renderCard(data?.EnYavasMudahaleSuresi, "En Yavaş Müdahale Süresi", "linear-gradient(to right, #ff4e50, #f9d423)")}
      {renderCard(data?.OrtalamaCalismaSuresi, "Ortalama Çalışma Süresi", "linear-gradient(to right, #00c6ff, #0072ff)")}
      {renderCard(data?.ToplamCalismaSuresi, "Toplam Çalışma Süresi", "linear-gradient(to right, #f7971e, #ffd200)")}
    </div>
  );
}

export default Component1;
