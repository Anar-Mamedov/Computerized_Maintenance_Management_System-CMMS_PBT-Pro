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

  const renderCard = (value, label) => (
    <div
      style={{
        flex: "1 1 calc(33.33% - 20px)", // Flex-grow, flex-shrink, flex-basis
        maxWidth: "calc(33.33% - 20px)",
        background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
        backgroundPosition: "inherit",
        backgroundSize: "cover",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "0px", // Alt satıra geçerken aralık bırakmak için
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
          <ClockCircleOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px", // Kartlar arasında boşluk bırakmak için
      }}
    >
      {renderCard(data?.ToplamTalepSayisi, "Toplam Talep Sayısı")}
      {renderCard(data?.OrtalamaMudahaleSuresi, "Ortalama Müdahale Süresi")}
      {renderCard(data?.EnHizliMudahaleSuresi, "En Hızlı Müdahale Süresi")}
      {renderCard(data?.EnYavasMudahaleSuresi, "En Yavaş Müdahale Süresi")}
      {renderCard(data?.OrtalamaCalismaSuresi, "Ortalama Çalışma Süresi")}
      {renderCard(data?.ToplamCalismaSuresi, "Toplam Çalışma Süresi")}
    </div>
  );
}

export default Component1;
