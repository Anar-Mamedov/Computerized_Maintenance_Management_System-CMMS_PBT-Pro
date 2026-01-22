import React from "react";
import { Typography, Tag, Button } from "antd";
import { 
  CalendarOutlined, 
  CarOutlined, 
  EnvironmentOutlined, 
  DashboardOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

const { Text, Title } = Typography;

// Mock Veri: Yaklaşan Periyodik Bakımlar
const maintenanceData = [
  {
    id: "EQ-00087",
    name: "Komatsu WA380 Loader",
    status: "Bakımda",
    daysLeft: 3,
    site: "Saha-2",
    counter: "8.105 sa",
  },
  {
    id: "EQ-00041",
    name: "JCB 3CX Kazıcı Yükleyici",
    status: "Aktif",
    daysLeft: 8,
    site: "Saha-3",
    counter: "2.110 sa",
  },
  {
    id: "EQ-00231",
    name: "CAT 336D Ekskavatör",
    status: "Aktif",
    daysLeft: 12,
    site: "Saha-1",
    counter: "3.420 sa",
  },
  {
    id: "EQ-00112",
    name: "Volvo A40G Damper",
    status: "Serviste",
    daysLeft: 20,
    site: "Saha-1",
    counter: "5.880 sa",
  },
];

// Durum Rengi
const getStatusColor = (status) => {
  switch (status) {
    case "Bakımda": return "volcano";
    case "Serviste": return "purple";
    case "Aktif": return "green";
    default: return "default";
  }
};

// Gün Aciliyet Rengi
const getDayColor = (days) => {
  if (days <= 3) return "#ff4d4f"; // Kritik
  if (days <= 10) return "#fa8c16"; // Yakın
  return "#1890ff"; // Normal
};

function Component4() {
  
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0", gap: "15px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ backgroundColor: "#e6f7ff", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CalendarOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
                </div>
                <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Yaklaşan Bakımlar</Title>
           </div>
        </div>
        <Button size="small" type="primary" danger ghost style={{ fontSize: "12px", fontWeight: "600" }}>
            Öncelik
        </Button>
      </div>

      {/* LIST CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "5px" }}>
        {maintenanceData.map((item) => (
            <div key={item.id} style={{ border: "1px solid #f0f0f0", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#fafafa" }}>
                
                {/* 1. Satır: İsim ve Kod */}
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <div style={{ 
                        width: "36px", height: "36px", backgroundColor: "white", borderRadius: "8px", 
                        display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #f0f0f0" 
                    }}>
                        <CarOutlined style={{ color: "#595959" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: "13px", color: "#262626", display: "block", lineHeight: "1.2" }}>{item.name}</Text>
                        <Text type="secondary" style={{ fontSize: "11px" }}>{item.id}</Text>
                    </div>
                </div>

                {/* 2. Satır: Durum ve Kalan Gün (Önemli Kısım) */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "8px", borderRadius: "6px", border: "1px solid #f0f0f0" }}>
                    <Tag color={getStatusColor(item.status)} style={{ margin: 0, fontSize: "11px", border: "none" }}>
                        {item.status}
                    </Tag>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <ClockCircleOutlined style={{ fontSize: "12px", color: getDayColor(item.daysLeft) }} />
                        <Text strong style={{ fontSize: "14px", color: getDayColor(item.daysLeft) }}>
                            {item.daysLeft} gün
                        </Text>
                    </div>
                </div>

                {/* 3. Satır: Saha ve Sayaç Detayı */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <EnvironmentOutlined style={{ fontSize: "12px", color: "#8c8c8c" }} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Text type="secondary" style={{ fontSize: "10px", lineHeight: "1" }}>Saha</Text>
                            <Text style={{ fontSize: "11px", color: "#595959" }}>{item.site}</Text>
                        </div>
                    </div>

                    <div style={{ width: "1px", height: "20px", backgroundColor: "#e8e8e8" }}></div>

                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <DashboardOutlined style={{ fontSize: "12px", color: "#8c8c8c" }} />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <Text type="secondary" style={{ fontSize: "10px", lineHeight: "1" }}>Son Sayaç</Text>
                            <Text style={{ fontSize: "11px", color: "#595959" }}>{item.counter}</Text>
                        </div>
                    </div>
                </div>

            </div>
        ))}
      </div>

    </div>
  );
}

export default Component4;