import React from "react";
import { Typography, Tag } from "antd";
import { WarningOutlined, AlertOutlined, SafetyOutlined, ToolOutlined, ShopOutlined, ExperimentOutlined, ArrowRightOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// Mock Veri: Kritik Uyarılar
const criticalAlerts = [
  {
    key: 1,
    level: "Kritik",
    category: "Yasal",
    description: "7 makine için muayene tarihi geçti",
    color: "#ff4d4f", // Kırmızı
    icon: <SafetyOutlined />,
  },
  {
    key: 2,
    level: "Yüksek",
    category: "Bakım",
    description: "3 ekipmanda periyodik bakım 3 gün içinde",
    color: "#fa8c16", // Turuncu
    icon: <ToolOutlined />,
  },
  {
    key: 3,
    level: "Orta",
    category: "Stok",
    description: "5 iş emri parça bekliyor (stok yetersiz)",
    color: "#faad14", // Sarı/Altın
    icon: <ShopOutlined />,
  },
  {
    key: 4,
    level: "Orta",
    category: "Yakıt",
    description: "2 şantiyede yakıt tüketimi sapması arttı",
    color: "#faad14", // Sarı/Altın
    icon: <ExperimentOutlined />,
  },
];

function AylikBakimMaliyetleri() { 
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        gap: "15px",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* --- HEADER --- */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              backgroundColor: "#fff1f0",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertOutlined style={{ color: "#ff4d4f", fontSize: "16px" }} />
          </div>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontSize: "18px" }}>
            Kritik Uyarılar
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
          Operasyonu etkileyen risk ve aksiyonlar
        </Text>
      </div>

      {/* --- CONTENT LIST --- */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "5px" }}>
        {criticalAlerts.map((item) => (
          <div
            key={item.key}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              paddingBottom: "12px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            {/* Etiketler (Seviye ve Kategori) */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Tag
                color={item.color}
                style={{
                  margin: 0,
                  fontWeight: "600",
                  fontSize: "11px",
                  borderRadius: "4px",
                  border: "none",
                }}
              >
                {item.level}
              </Tag>
              <Text strong style={{ fontSize: "12px", color: "#595959", display: "flex", alignItems: "center", gap: "4px" }}>
                 <span style={{ color: "#8c8c8c" }}>{item.icon}</span> {item.category}
              </Text>
            </div>

            {/* Açıklama */}
            <Text style={{ fontSize: "13px", color: "#262626", lineHeight: "1.4" }}>
              {item.description}
            </Text>
          </div>
        ))}
      </div>

      {/* --- FOOTER --- */}
      <div style={{ marginTop: "auto", paddingTop: "5px", textAlign: "right" }}>
        <a href="#" style={{ fontSize: "12px", color: "#1890ff", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          Tüm Uyarılar <ArrowRightOutlined style={{ fontSize: "10px" }} />
        </a>
      </div>
    </div>
  );
}

export default AylikBakimMaliyetleri;