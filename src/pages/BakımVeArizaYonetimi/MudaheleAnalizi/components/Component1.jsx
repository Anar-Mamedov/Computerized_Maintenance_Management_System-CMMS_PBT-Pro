import React, { useState, useEffect } from "react";
import bg from "../../../../assets/images/bg-card.png";
import { Modal, Spin, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

function Component1({ updateApi }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const lokasyonId = watch("locationIds");
  const atolyeId = watch("atolyeIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");

  const fetchData = async () => {
    setIsLoading(true);
    const currentYear = new Date().getFullYear();
    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      BaslangicTarih: baslangicTarihi || "",
      BitisTarih: bitisTarihi || "",
      // Yil: currentYear,
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

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", flexDirection: "row" }}>
      <div
        style={{
          width: "300px",
          height: "110px",
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        {isLoading ? ( // isLoading durumu true olduğunda bu kod bloğu çalışır
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Spin size="large" style={{ color: "#fff" }}></Spin>
          </div> // isLoading durumu false olduğunda bu kod bloğu çalışır
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: "35px",
                  color: "white",
                }}
              >
                {data?.ToplamTalepSayisi !== undefined ? data.ToplamTalepSayisi : ""}
              </Text>
              <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>Toplam Talep Sayısı</Text>
            </div>
            <ClockCircleOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
          </div>
        )}
      </div>
      <div
        style={{
          width: "300px",
          height: "110px",
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        {isLoading ? ( // isLoading durumu true olduğunda bu kod bloğu çalışır
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Spin size="large" style={{ color: "#fff" }}></Spin>
          </div> // isLoading durumu false olduğunda bu kod bloğu çalışır
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: "35px",
                  color: "white",
                }}
              >
                {data?.OrtalamaMudahaleSuresi !== undefined ? data.OrtalamaMudahaleSuresi : ""}
              </Text>
              <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>Ortalama Müdahale Süresi</Text>
            </div>
            <ClockCircleOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
          </div>
        )}
      </div>
      <div
        style={{
          width: "300px",
          height: "110px",
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        {isLoading ? ( // isLoading durumu true olduğunda bu kod bloğu çalışır
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Spin size="large" style={{ color: "#fff" }}></Spin>
          </div> // isLoading durumu false olduğunda bu kod bloğu çalışır
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: "35px",
                  color: "white",
                }}
              >
                {data?.EnHizliMudahaleSuresi !== undefined ? data.EnHizliMudahaleSuresi : ""}
              </Text>
              <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>En Hızlı Müdahale Süresi</Text>
            </div>
            <ClockCircleOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
          </div>
        )}
      </div>
      <div
        style={{
          width: "300px",
          height: "110px",
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        {isLoading ? ( // isLoading durumu true olduğunda bu kod bloğu çalışır
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Spin size="large" style={{ color: "#fff" }}></Spin>
          </div> // isLoading durumu false olduğunda bu kod bloğu çalışır
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: "35px",
                  color: "white",
                }}
              >
                {data?.EnYavasMudahaleSuresi !== undefined ? data.EnYavasMudahaleSuresi : ""}
              </Text>
              <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>En Yavaş Müdahale Süresi</Text>
            </div>
            <ClockCircleOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
          </div>
        )}
      </div>
      <div
        style={{
          width: "300px",
          height: "110px",
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        {isLoading ? ( // isLoading durumu true olduğunda bu kod bloğu çalışır
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Spin size="large" style={{ color: "#fff" }}></Spin>
          </div> // isLoading durumu false olduğunda bu kod bloğu çalışır
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: "35px",
                  color: "white",
                }}
              >
                {data?.OrtalamaCalismaSuresi !== undefined ? data.OrtalamaCalismaSuresi : ""}
              </Text>
              <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>Ortalama Çalışma Süresi</Text>
            </div>
            <ClockCircleOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
          </div>
        )}
      </div>{" "}
      <div
        style={{
          width: "300px",
          height: "110px",
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        {isLoading ? ( // isLoading durumu true olduğunda bu kod bloğu çalışır
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Spin size="large" style={{ color: "#fff" }}></Spin>
          </div> // isLoading durumu false olduğunda bu kod bloğu çalışır
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: "35px",
                  color: "white",
                }}
              >
                {data?.ToplamCalismaSuresi !== undefined ? data.ToplamCalismaSuresi : ""}
              </Text>
              <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>Toplam Çalışma Süresi</Text>
            </div>
            <ClockCircleOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Component1;
