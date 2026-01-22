import React from "react";
import { Typography, Table, Tag } from "antd";
import { AlertOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// Mock Veri: Son Arızalar
const recentFailures = [
  {
    key: "1",
    machine: "EXC-214",
    site: "Şantiye A",
    reason: "Hidrolik",
    time: "Bugün 10:20",
    level: "Yüksek",
  },
  {
    key: "2",
    machine: "LDR-088",
    site: "Şantiye C",
    reason: "Elektrik",
    time: "Dün 18:05",
    level: "Orta",
  },
  {
    key: "3",
    machine: "DMP-031",
    site: "Şantiye B",
    reason: "Motor",
    time: "Dün 13:44",
    level: "Yüksek",
  },
  {
    key: "4",
    machine: "TRK-552",
    site: "Şantiye A",
    reason: "Lastik",
    time: "Dün 09:12",
    level: "Düşük",
  },
];

// Seviyeye göre renk belirleme
const getLevelColor = (level) => {
  switch (level) {
    case "Yüksek": return "red";
    case "Orta": return "orange";
    case "Düşük": return "green";
    default: return "default";
  }
};

// Tablo Kolonları
const columns = [
  {
    title: "Makine",
    dataIndex: "machine",
    key: "machine",
    render: (text) => <Text strong>{text}</Text>,
  },
  {
    title: "Şantiye",
    dataIndex: "site",
    key: "site",
    responsive: ["md"], // Küçük ekranda gizlenebilir
  },
  {
    title: "Neden",
    dataIndex: "reason",
    key: "reason",
  },
  {
    title: "Zaman",
    dataIndex: "time",
    key: "time",
    render: (text) => <Text type="secondary" style={{ fontSize: "12px" }}>{text}</Text>,
  },
  {
    title: "Seviye",
    dataIndex: "level",
    key: "level",
    align: "center",
    render: (level) => (
      <Tag color={getLevelColor(level)} style={{ margin: 0, fontSize: "11px", fontWeight: "600", border: "none" }}>
        {level}
      </Tag>
    ),
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
              backgroundColor: "#fff2e8",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertOutlined style={{ color: "#fa541c", fontSize: "16px" }} />
          </div>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontSize: "18px" }}>
            Son Arızalar
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
          Son 24 saat bildirilen arızalar (örnek)
        </Text>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <Table
          columns={columns}
          dataSource={recentFailures}
          pagination={false}
          size="small"
          rowKey="key"
          onRow={() => ({
            style: { cursor: "pointer" }, // Satıra tıklanabilir hissi ver
          })}
        />
      </div>

    </div>
  );
}

export default AylikBakimMaliyetleri;