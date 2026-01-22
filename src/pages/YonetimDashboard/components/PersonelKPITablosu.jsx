import React from "react";
import { Typography, Progress, Tooltip } from "antd";
import { RightCircleOutlined, PieChartOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// Statik Mock Veri (Prompt'taki veriler)
const costDistributionData = [
  {
    name: "Yakıt",
    amount: "₺50.200.000",
    percentage: 45.8,
    color: "#ff4d4f", // Kırmızı ton
  },
  {
    name: "Bakım",
    amount: "₺21.200.000",
    percentage: 19.4,
    color: "#1890ff", // Mavi ton
  },
  {
    name: "Parça",
    amount: "₺17.700.000",
    percentage: 16.2,
    color: "#faad14", // Turuncu/Altın ton
  },
  {
    name: "Taşeron",
    amount: "₺13.100.000",
    percentage: 12.0,
    color: "#13c2c2", // Turkuaz ton
  },
  {
    name: "Diğer",
    amount: "₺7.300.000",
    percentage: 6.7,
    color: "#722ed1", // Mor ton
  },
];

function PersonelKPITablosu() {
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
              backgroundColor: "#e6f7ff",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PieChartOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
          </div>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontSize: "18px" }}>
            Maliyet Dağılımı (Yıl İçinde)
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
          Ana maliyet kalemlerinin toplam içindeki payı ve hızlı karşılaştırma
        </Text>
      </div>

      {/* --- CONTENT LIST --- */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px", paddingRight: "5px" }}>
        {costDistributionData.map((item, index) => (
          <div key={index}>
            {/* Üst Satır: İsim ve Tutar */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <Text strong style={{ color: "#434343", fontSize: "14px" }}>
                {item.name}
              </Text>
              <Text strong style={{ fontSize: "14px" }}>
                {item.amount}
              </Text>
            </div>

            {/* Orta: Progress Bar */}
            <Tooltip title={`Toplam içindeki payı: %${item.percentage}`}>
              <Progress
                percent={item.percentage}
                strokeColor={item.color}
                showInfo={false}
                size="small"
                trailColor="#f5f5f5"
                style={{ marginBottom: "2px" }}
              />
            </Tooltip>

            {/* Alt Satır: Yüzdelik Pay */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Pay: <span style={{ color: item.color, fontWeight: "600" }}>%{item.percentage}</span>
              </Text>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER / TIP --- */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <RightCircleOutlined style={{ color: "#8c8c8c", marginTop: "2px" }} />
        <Text type="secondary" style={{ fontSize: "11px", lineHeight: "1.4" }}>
          İpucu: Kalem payları, yöneticiye “hangi maliyet türü baskın?” sorusuna tek bakışta cevap verir.
        </Text>
      </div>
    </div>
  );
}

export default PersonelKPITablosu;