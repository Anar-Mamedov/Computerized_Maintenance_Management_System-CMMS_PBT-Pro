import React from "react";
import bg from "/images/bg-card.png";
import { Spin, Typography, Tooltip } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { t } from "i18next";

const { Text } = Typography;

function Component5({ apiData, isEmriAd, loading }) {

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
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
            
            {/* Grid sistemiyle değerleri yan yana kilitledik. Verilerin kaybolma şansı yok artık kanka. */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "auto 1fr", 
              alignItems: "baseline", 
              width: "100%" 
            }}>
              
              {/* Değer ve Birim kısmı (Sol sütun - Kendi genişliği kadar yer kaplar) */}
              <div style={{ whiteSpace: "nowrap", paddingRight: "6px" }}>
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
                </Text>
              </div>
              
              {/* İş Emri Adı Kısmı (Sağ sütun - Kalan tüm alanı kaplar ve taşarsa 3 nokta koyar) */}
              {subValue ? (
                <div style={{ 
                  display: "flex", 
                  alignItems: "baseline", 
                  overflow: "hidden",
                  width: "100%"
                }}>
                  <span style={{ fontSize: "16px", color: "#595959", marginRight: "6px" }}>/</span>
                  <Tooltip title={subValue} placement="top">
                    <span 
                      style={{ 
                        fontSize: "16px", 
                        color: "#595959", 
                        fontWeight: "400",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                        width: "100%"
                      }}
                    >
                      {subValue}
                    </span>
                  </Tooltip>
                </div>
              ) : null}
            </div>
            
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
        isEmriAd, 
        t("En Yüksek Maliyetli İş Emri"), 
        null, 
        t("₺"), // Birim TL olarak kalıyor
        loading 
      )}
    </div>
  );
}

export default Component5;