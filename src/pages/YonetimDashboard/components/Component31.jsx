import React from "react";
import { Typography, Table, Tag } from "antd";
import { ScheduleOutlined, RightCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// Mock Veri: Planlı Bakımlar
const maintenanceData = [
  {
    key: "1",
    machine: "EXC-118",
    location: "Şantiye B",
    plan: "250s Periyodik",
    date: "29 Ara",
    status: "Yaklaşıyor",
  },
  {
    key: "2",
    machine: "GRD-014",
    location: "Şantiye C",
    plan: "1000s Periyodik",
    date: "30 Ara",
    status: "Yaklaşıyor",
  },
  {
    key: "3",
    machine: "LDR-041",
    location: "Şantiye A",
    plan: "Yağ/Filtre",
    date: "02 Oca",
    status: "Planlı",
  },
];

// Duruma göre renk belirleme
const getStatusColor = (status) => {
  switch (status) {
    case "Yaklaşıyor": return "warning"; // Turuncu
    case "Planlı": return "processing";  // Mavi
    default: return "default";
  }
};

// Tablo Kolonları
const columns = [
  {
    title: "Makine",
    dataIndex: "machine",
    key: "machine",
    render: (text, record) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text strong style={{ fontSize: "13px" }}>{text}</Text>
        <Text type="secondary" style={{ fontSize: "11px" }}>
          • {record.location}
        </Text>
      </div>
    ),
  },
  {
    title: "Plan",
    dataIndex: "plan",
    key: "plan",
    render: (text) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
  },
  {
    title: "Tarih",
    dataIndex: "date",
    key: "date",
    render: (text) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
  },
  {
    title: "Durum",
    dataIndex: "status",
    key: "status",
    align: "right",
    render: (status) => (
      <Tag color={getStatusColor(status)} style={{ margin: 0, fontSize: "11px", fontWeight: "600", border: "none" }}>
        {status}
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
              backgroundColor: "#e6f7ff",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScheduleOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
          </div>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontSize: "18px" }}>
            Planlı Bakımlar
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
          Yaklaşan planlar ve durumlar
        </Text>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <Table
          columns={columns}
          dataSource={maintenanceData}
          pagination={false}
          size="small"
          rowKey="key"
          onRow={() => ({
            style: { cursor: "pointer" }, 
          })}
        />
      </div>

      {/* --- FOOTER --- */}
      <div style={{ marginTop: "auto", paddingTop: "10px", textAlign: "right", borderTop: "1px solid #f0f0f0" }}>
        <a href="#" style={{ fontSize: "12px", color: "#1890ff", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          Bakım Planlarını Aç <RightCircleOutlined style={{ fontSize: "12px" }} />
        </a>
      </div>

    </div>
  );
}

export default AylikBakimMaliyetleri;