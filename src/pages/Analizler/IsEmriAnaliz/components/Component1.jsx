import React from "react";
import bg from "/images/bg-card.png";
import { Spin, Typography } from "antd";
import { BorderInnerOutlined } from "@ant-design/icons";
import { t } from "i18next";

const { Text } = Typography;

// Ana ekrandan gelen apiData (yani ToplamIsEmri) ve loading proplarını yakalıyoruz
function Component1({ apiData, loading }) {

  const renderCard = (value, label, backgroundColor, unit, isLoading) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: backgroundColor || `linear-gradient(rgba(245, 245, 245, 0.9), rgba(240, 240, 240, 0.9)), url(${bg})`,
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
            <Text style={{ fontWeight: "600", fontSize: "28px", color: "#1f1f1f" }}>
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
            <BorderInnerOutlined style={{ fontSize: "22px", color: "#bfbfbf" }} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {renderCard(
        apiData, // Ana ekrandan gelen doğrudan ToplamIsEmri değeri
        t("Toplam İş Emri"), 
        null, 
        null, 
        loading // Ana ekrandan gelen yükleniyor state'i
      )}
    </div>
  );
}

export default Component1;