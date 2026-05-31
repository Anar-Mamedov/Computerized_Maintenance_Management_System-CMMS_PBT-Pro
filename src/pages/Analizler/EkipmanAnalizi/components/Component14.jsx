import React from "react";
import bg from "/images/bg-card.png";
import { Spin, Typography } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { t } from "i18next";

const { Text } = Typography;

// Kanka isEmriAd prop'unu buraya ekledik
function Component5({ apiData, isEmriAd, loading }) {

  // subValue (isEmriAd) parametresini renderCard fonksiyonuna ekledik
  const renderCard = (value, subValue, label, backgroundColor, unit, isLoading) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: backgroundColor || "#ffffff",
        backgroundPosition: "inherit",
        backgroundSize: "cover",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "0px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        position: "relative",
        border: "1px solid #e8e8e8",
      }}
    >
      {isLoading ? (
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
            <Text style={{ fontWeight: "600", fontSize: "24px", color: "#1f1f1f", lineHeight: "1.2" }}>
              {value !== null && value !== undefined ? (
                <>
                  {Number(value).toLocaleString("tr-TR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  {unit && <span style={{ fontSize: "16px", color: "#8c8c8c" }}> ({unit})</span>}
                </>
              ) : (
                "0"
              )}
              
              {/* Kanka apiData'nın yanına / işareti ile isEmriAd'ı buraya bastık */}
              {subValue && (
                <span style={{ fontSize: "16px", color: "#595959", fontWeight: "400" }}>
                  {` / ${subValue}`}
                </span>
              )}
            </Text>
            
            <Text style={{ color: "#8c8c8c", fontSize: "14px", fontWeight: "500", marginTop: "6px" }}>
              {label}
            </Text>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {renderCard(
        apiData, 
        isEmriAd, // Buradan fonksiyona pasladık
        t("En Uzun Süren İş Emri"), 
        null, 
        t("Saat"), // Null yerine istersen birim olarak Saat yazabilirsin, burayı eski haline (null) de çekebilirsin.
        loading 
      )}
    </div>
  );
}

export default Component5;