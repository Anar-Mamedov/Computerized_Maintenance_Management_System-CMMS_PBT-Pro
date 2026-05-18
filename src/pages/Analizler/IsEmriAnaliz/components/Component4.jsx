import React, { useState, useEffect } from "react";
import bg from "/images/bg-card.png";
import { Spin, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons"; // İkon için import ekledik
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import { t } from "i18next";
import dayjs from "dayjs";

const { Text } = Typography;

function ComponentSingleCard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { watch } = useFormContext();

  // Form değerlerini izle
  const lokasyonId = watch("locationValues");
  const baslangicTarihi = watch("baslangicTarihi") ? dayjs(watch("baslangicTarihi")).format("YYYY-MM-DD") : null;
  const bitisTarihi = watch("bitisTarihi") ? dayjs(watch("bitisTarihi")).format("YYYY-MM-DD") : null;
  const atolyeId = watch("atolyeIds");
  const makineId = watch("makineIds");

  const fetchData = async () => {
    setIsLoading(true);

    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      MakineId: makineId || "",
      BaslangicTarih: baslangicTarihi || null,
      BitisTarih: bitisTarihi || null,
    };

    try {
      // Sadece type=1 ile tek bir istek
      const response = await AxiosInstance.post("", body);
      setData(response.ToplamTalepSayisi);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonId, baslangicTarihi, bitisTarihi]);

  const renderCard = (value, label, backgroundColor, unit, loading) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        // Arka plan rengini açık gri yaptık, bg imajını soft bir overlay olarak bıraktım (isteğe bağlı kaldırabilirsin)
        background: backgroundColor || `linear-gradient(rgba(245, 245, 245, 0.9), rgba(240, 240, 240, 0.9)), url(${bg})`,
        backgroundPosition: "inherit",
        backgroundSize: "cover",
        borderRadius: "8px", // Biraz daha modern dursun diye ovalleştirdim
        padding: "16px",
        marginBottom: "0px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // Soft bir gölge
        position: "relative", // İkonu sağ üste sabitlemek için relative şart
        border: "1px solid #e8e8e8", // Belirginlik için hafif border
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spin size="large" style={{ color: "#1890ff" }} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
            height: "100%",
          }}
        >
          {/* Sol Taraf: Metin İçerikleri */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Text style={{ fontWeight: "600", fontSize: "32px", color: "#1f1f1f" }}>
              {value !== null && value !== undefined ? (
                <>
                  {Number(value).toLocaleString("tr-TR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  {unit && <span style={{ fontSize: "18px", color: "#8c8c8c" }}> ({unit})</span>}
                </>
              ) : (
                "0"
              )}
            </Text>
            <Text style={{ color: "#8c8c8c", fontSize: "14px", fontWeight: "500", marginTop: "4px" }}>
              {label}
            </Text>
          </div>

          {/* Sağ Üst Köşe: İkon Alanı */}
          <div style={{ position: "absolute", top: "16px", right: "16px" }}>
            <SettingOutlined style={{ fontSize: "22px", color: "#bfbfbf" }} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {renderCard(
        data, 
        t("Ortalama Kapanış Süresi"), 
        null, // Custom arka plan rengi yollamak istersen buraya string yazabilirsin
        null, // Birim
        isLoading 
      )}
    </div>
  );
}

export default ComponentSingleCard;