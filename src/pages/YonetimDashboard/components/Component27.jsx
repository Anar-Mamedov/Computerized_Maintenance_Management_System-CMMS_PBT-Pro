import React from "react";
import { Typography, Tag } from "antd";
import { ShopOutlined, TrophyOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// Mock Veri: En Büyük 5 Tedarikçi
const supplierData = [
  { name: "Atlas Makina", amount: "₺1.140.000", orders: 24, otif: 92 },
  { name: "Bursa Hidrolik", amount: "₺980.000", orders: 18, otif: 89 },
  { name: "Kuzey Lastik", amount: "₺860.000", orders: 31, otif: 85 },
  { name: "Delta Yağlama", amount: "₺740.000", orders: 15, otif: 94 },
  { name: "Orion Elektrik", amount: "₺690.000", orders: 12, otif: 88 },
];

// OTIF değerine göre renk belirleme
const getOtifColor = (val) => {
  if (val >= 90) return "success"; // Yeşil
  if (val >= 80) return "warning"; // Turuncu
  return "error";                  // Kırmızı
};

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
              backgroundColor: "#fff7e6",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShopOutlined style={{ color: "#fa8c16", fontSize: "16px" }} />
          </div>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontSize: "18px" }}>
            En Büyük 5 Tedarikçi
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
          Dönem harcaması ve sipariş performansı
        </Text>
      </div>

      {/* --- CONTENT LIST --- */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0" }}>
        
        {/* Liste Başlıkları */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px 8px 10px", borderBottom: "1px solid #f0f0f0", marginBottom: "8px" }}>
           <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600", flex: 2 }}>TEDARİKÇİ</Text>
           <div style={{ display: "flex", flex: 3, justifyContent: "space-between" }}>
             <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600", width: "80px", textAlign: "right" }}>HARCAMA</Text>
             <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600", width: "50px", textAlign: "center" }}>SİPARİŞ</Text>
             <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600", width: "50px", textAlign: "right" }}>OTIF</Text>
           </div>
        </div>

        {supplierData.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              borderRadius: "8px",
              transition: "background-color 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {/* İsim */}
            <div style={{ flex: 2, display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                {index === 0 && <TrophyOutlined style={{ color: "#faad14", fontSize: "12px" }} />} {/* 1. olana kupa */}
                <Text strong style={{ color: "#434343", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                </Text>
            </div>

            {/* Değerler */}
            <div style={{ flex: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text strong style={{ fontSize: "13px", color: "#262626", width: "80px", textAlign: "right" }}>
                  {item.amount}
              </Text>
              <Text type="secondary" style={{ fontSize: "13px", width: "50px", textAlign: "center" }}>
                  {item.orders}
              </Text>
              <div style={{ width: "50px", display: "flex", justifyContent: "flex-end" }}>
                  <Tag color={getOtifColor(item.otif)} style={{ margin: 0, fontWeight: "600", fontSize: "11px", border: "none" }}>
                      %{item.otif}
                  </Tag>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AylikBakimMaliyetleri;