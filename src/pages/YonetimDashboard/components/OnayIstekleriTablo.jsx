import React from "react";
import { Typography, Tag, Tooltip } from "antd";
import { ShopOutlined, ArrowUpOutlined, ArrowDownOutlined, WarningOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// Mock Veri: En Büyük 5 Tedarikçi
const topSuppliersData = [
  {
    name: "Tedarikçi A",
    amount: "₺3.150.000",
    change: 8, // +8%
    key: 1,
  },
  {
    name: "Tedarikçi B",
    amount: "₺2.720.000",
    change: 5, // +5%
    key: 2,
  },
  {
    name: "Tedarikçi C",
    amount: "₺2.120.000",
    change: -2, // -2%
    key: 3,
  },
  {
    name: "Tedarikçi D",
    amount: "₺1.760.000",
    change: 4, // +4%
    key: 4,
  },
  {
    name: "Tedarikçi E",
    amount: "₺1.440.000",
    change: 1, // +1%
    key: 5,
  },
];

function LokasyonBazindaIsTalepleri() {
  
  // Değişim oranına göre renk ve ikon belirleme fonksiyonu
  const getChangeTag = (change) => {
    const isPositive = change > 0;
    return (
      <Tag
        color={isPositive ? "success" : "error"}
        style={{
          margin: 0,
          borderRadius: "12px",
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          border: "none",
          backgroundColor: isPositive ? "#f6ffed" : "#fff1f0",
          color: isPositive ? "#389e0d" : "#cf1322",
        }}
      >
        {isPositive ? <ArrowUpOutlined style={{ fontSize: "10px" }} /> : <ArrowDownOutlined style={{ fontSize: "10px" }} />}
        <span style={{ fontWeight: "600", fontSize: "12px" }}>%{Math.abs(change)}</span>
      </Tag>
    );
  };

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
          Harcama yoğunlaşması ve hızlı değişim göstergesi
        </Text>
      </div>

      {/* --- CONTENT LIST --- */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0px" }}>
        
        {/* Liste Başlıkları */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px 8px 10px", borderBottom: "1px solid #f0f0f0", marginBottom: "8px" }}>
           <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600" }}>TEDARİKÇİ</Text>
           <div style={{ display: "flex", gap: "30px" }}>
             <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600" }}>TUTAR</Text>
             <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600", minWidth: "55px", textAlign:"right" }}>DEĞİŞİM</Text>
           </div>
        </div>

        {topSuppliersData.map((item) => (
          <div
            key={item.key}
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold", color: "#8c8c8c" }}>
                    {item.key}
                </div>
                <Text strong style={{ color: "#434343", fontSize: "13px" }}>{item.name}</Text>
            </div>

            {/* Tutar ve Değişim */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Text strong style={{ fontSize: "13px" }}>{item.amount}</Text>
              <div style={{ minWidth: "60px", display: "flex", justifyContent: "flex-end" }}>
                  {getChangeTag(item.change)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER / RISK ANALYSIS --- */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
             <WarningOutlined style={{ color: "#faad14" }} />
             <Text style={{ fontSize: "12px", color: "#595959", fontWeight: "500" }}>
                Yoğunlaşma riski:
             </Text>
        </div>
        <Text type="secondary" style={{ fontSize: "11px", marginLeft: "20px" }}>
            İlk 2 tedarikçi toplam harcamanın <strong style={{ color: "#595959" }}>~%31</strong>’i
        </Text>
        
        <div style={{ marginTop: "5px", textAlign: "right" }}>
            <a href="#" style={{ fontSize: "12px", color: "#1890ff" }}>Satınalma Detayı &rarr;</a>
        </div>
      </div>
    </div>
  );
}

export default LokasyonBazindaIsTalepleri;