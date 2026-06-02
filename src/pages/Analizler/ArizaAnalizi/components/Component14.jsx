import React from "react";
import { Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

function Component1({ apiData, arizaSayi, loading }) {
  const { t } = useTranslation();

  const renderCard = (equipmentName, totalFailures, backgroundColor, isLoading) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "110px", // Kartın aşırı basık durmasını engeller
        background: backgroundColor || "#ffffff",
        borderRadius: "8px",
        padding: "12px 16px", // Responsive ekranlarda daha dengeli padding
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        position: "relative",
        border: "1px solid #e8e8e8",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Spin size="large" style={{ color: "#1890ff" }} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // İçerikleri yukarıdan aşağıya dengeli dağıtır
            height: "100%",
            flexGrow: 1,
            gap: "2px", // Elemanlar arası dinamik boşluk
          }}
        >
          {/* 1. ÜST KISIM: Başlık */}
          <Text
            style={{
              color: "#8c8c8c",
              fontSize: "0.85rem", // Ekran çözünürlüğüne göre ölçeklenir
              fontWeight: "400",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t("En Çok Arızalanan Ekipman")}
          </Text>

          {/* 2. ORTA KISIM: Ekipman Adı */}
          <Text
            style={{
              fontWeight: "700",
              fontSize: "1.2rem", // Grid/Kart boyutuna uyum sağlayan font boyutu
              color: "#111827", // Fotoğraftaki gibi net ve şık bir koyu ton
              lineHeight: "1.25",
              wordBreak: "break-word", // Çok uzun isimlerde taşma yapmaz, alt satıra geçer
              display: "-webkit-box",
              WebkitLineClamp: 2, // Maksimum 2 satır izin verir, tasarımın patlamasını önler
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={equipmentName} // Mouse ile üzerine gelindiğinde tam ismi gösterir
          >
            {equipmentName || t("Bilinmeyen Ekipman")}
          </Text>

          {/* 3. ALT KISIM: Arıza Sayısı */}
          <Text
            style={{
              color: "#8c8c8c",
              fontSize: "0.85rem",
              fontWeight: "400",
              gap: "2px",
            }}
          >
            {totalFailures !== null && totalFailures !== undefined
              ? `${totalFailures} ${t("tekrar")}`
              : `0 ${t("tekrar")}`}
          </Text>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      {renderCard(apiData, arizaSayi, null, loading)}
    </div>
  );
}

export default Component1;