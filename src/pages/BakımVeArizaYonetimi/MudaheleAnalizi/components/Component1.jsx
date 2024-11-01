import React, { useState, useEffect } from "react";
import bg from "../../../../assets/images/bg-card.png";
import { Spin, Typography } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import dayjs from "dayjs";

const { Text } = Typography;

function Component1() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
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
      BaslangicTarih: baslangicTarihi ? dayjs(baslangicTarihi).format("YYYY-MM-DD") : "",
      BitisTarih: bitisTarihi ? dayjs(bitisTarihi).format("YYYY-MM-DD") : "",
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
  }, [lokasyonId, atolyeId, makineId, baslangicTarihi, bitisTarihi]);

  const renderCard = (value, label, backgroundColor, appendUnit) => (
    <div
      style={{
        flex: "1 1 16%",
        maxWidth: "16%",
        background: backgroundColor || `url(${bg}), linear-gradient(rgb(27 17 92), #007eff)`,
        backgroundPosition: "inherit",
        backgroundSize: "cover",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "0px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
      }}
    >
      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <Spin size="large" style={{ color: "#fff" }} />
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Text style={{ fontWeight: "500", fontSize: "35px", color: "white" }} ellipsis={{ tooltip: value }}>
              {value !== undefined ? (
                <>
                  {value}
                  {appendUnit && <span style={{ fontSize: "20px" }}> (dk.)</span>}
                </>
              ) : (
                ""
              )}
            </Text>
            <Text style={{ color: "white", fontSize: "15px", fontWeight: "400", marginTop: "5px" }} ellipsis>
              {label}
            </Text>
          </div>
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
        justifyContent: "space-between",
      }}
    >
      {renderCard(data?.ToplamTalepSayisi, "Toplam Talep Sayısı", "linear-gradient(to right, #ff7e5f, #feb47b)", false)}
      {renderCard(data?.OrtalamaMudahaleSuresi, "Ortalama Müdahale Süresi", "linear-gradient(to right, #6a11cb, #2575fc)", true)}
      {renderCard(data?.EnHizliMudahaleSuresi, "En Hızlı Müdahale Süresi", "linear-gradient(to right, #43cea2, #185a9d)", true)}
      {renderCard(data?.EnYavasMudahaleSuresi, "En Yavaş Müdahale Süresi", "linear-gradient(to right, #ff4e50, #f9d423)", true)}
      {renderCard(data?.OrtalamaCalismaSuresi, "Ortalama Çalışma Süresi", "linear-gradient(to right, #00c6ff, #0072ff)", true)}
      {renderCard(data?.ToplamCalismaSuresi, "Toplam Çalışma Süresi", "linear-gradient(to right, #f7971e, #ffd200)", true)}
    </div>
  );
}

export default Component1;
