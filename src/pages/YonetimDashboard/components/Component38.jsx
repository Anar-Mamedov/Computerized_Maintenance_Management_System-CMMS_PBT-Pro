import React from "react";
import { Typography, Tag, Button, Progress, Avatar } from "antd";
import { 
  CarOutlined, 
  ToolOutlined, 
  SafetyCertificateOutlined, 
  RightOutlined,
  ExclamationCircleOutlined 
} from "@ant-design/icons";

const { Text, Title } = Typography;

// Mock Veri: Kritik Ekipmanlar
const equipmentData = [
  {
    id: "EQ-00087",
    status: "Bakımda",
    name: "Komatsu WA380 Loader",
    location: "Saha-2",
    type: "Loader",
    usage: 42,
    cost: "₺589.250",
    maintenance: "3 gün",
    counter: "8.105 sa",
    tags: ["Yüksek maliyet", "Bakım yaklaşıyor", "Bakımda"],
    tagColors: ["volcano", "orange", "red"],
  },
  {
    id: "EQ-00112",
    status: "Serviste",
    name: "Volvo A40G Damper",
    location: "Saha-1",
    type: "Damper",
    usage: 65,
    cost: "₺740.980",
    maintenance: "20 gün",
    counter: "5.880 sa",
    tags: ["Yüksek maliyet", "Serviste"],
    tagColors: ["volcano", "purple"],
  },
  {
    id: "EQ-00231",
    status: "Aktif",
    name: "CAT 336D Ekskavatör",
    location: "Saha-1",
    type: "Ekskavatör",
    usage: 78,
    cost: "₺412.600",
    maintenance: "12 gün",
    counter: "3.420 sa",
    tags: [], // Aktif olduğu için risk tag'i yok
    tagColors: [],
  },
  {
    id: "EQ-00041",
    status: "Aktif",
    name: "JCB 3CX Kazıcı Yükleyici",
    location: "Saha-3",
    type: "Backhoe",
    usage: 83,
    cost: "₺198.400",
    maintenance: "8 gün",
    counter: "2.110 sa",
    tags: [],
    tagColors: [],
  },
];

// Durum Rengi Helper
const getStatusColor = (status) => {
  switch (status) {
    case "Bakımda": return "#ff4d4f"; // Kırmızı
    case "Serviste": return "#722ed1"; // Mor
    case "Aktif": return "#52c41a";    // Yeşil
    default: return "#bfbfbf";
  }
};

function Component4() {
  
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0", gap: "15px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Kritik Ekipmanlar</Title>
          <Text type="secondary" style={{ fontSize: "12px", maxWidth: "250px", display: "block" }}>
            Risk; maliyet, yaklaşan bakım ve durum sinyallere göre hesaplanır.
          </Text>
        </div>
        
        {/* Header Butonları */}
        <div style={{ display: "flex", gap: "8px" }}>
             <Button size="small" type="primary" ghost style={{ fontSize: "12px" }}>Öncelik</Button>
             <Button size="small" style={{ fontSize: "12px" }}>Tüm Ekipmanlar</Button>
        </div>
      </div>

      {/* LIST CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "5px" }}>
        {equipmentData.map((item) => (
            <div key={item.id} style={{ border: "1px solid #f0f0f0", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                
                {/* 1. SATIR: Üst Bilgi (İkon, İsim, Durum) */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    {/* İkon */}
                    <div style={{ 
                        width: "40px", height: "40px", backgroundColor: "#f5f5f5", borderRadius: "8px", 
                        display: "flex", alignItems: "center", justifyContent: "center" 
                    }}>
                        <CarOutlined style={{ fontSize: "20px", color: "#595959" }} />
                    </div>

                    {/* İsim ve ID */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text strong style={{ fontSize: "14px", color: "#262626" }}>{item.id}</Text>
                            <Tag color={getStatusColor(item.status)} style={{ margin: 0, fontSize: "10px", border: "none" }}>{item.status}</Tag>
                        </div>
                        <Text style={{ fontSize: "13px", color: "#1f1f1f", display: "block" }}>{item.name}</Text>
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                            {item.location} • {item.type}
                        </Text>
                    </div>

                    {/* Kullanım Oranı (Circle Progress) */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                         <Progress type="circle" percent={item.usage} width={36} strokeWidth={10} strokeColor={getStatusColor(item.status)} format={() => ""} />
                         <Text type="secondary" style={{ fontSize: "10px", marginTop: "2px" }}>%{item.usage}</Text>
                    </div>
                </div>

                {/* 2. SATIR: Taglar (Varsa) */}
                {item.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {item.tags.map((tag, idx) => (
                            <Tag key={idx} color={item.tagColors[idx]} style={{ margin: 0, fontSize: "10px" }}>
                                {tag}
                            </Tag>
                        ))}
                    </div>
                )}

                {/* 3. SATIR: Detaylar (Maliyet, Bakım, Sayaç) */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafafa", padding: "8px", borderRadius: "6px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                         <Text strong style={{ fontSize: "13px", color: "#262626" }}>{item.cost}</Text>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                         <Text style={{ fontSize: "11px", color: "#595959" }}>Bakım: <span style={{ fontWeight: "600", color: "#fa8c16" }}>{item.maintenance}</span></Text>
                         <Text type="secondary" style={{ fontSize: "10px" }}>Son Sayaç: {item.counter}</Text>
                    </div>
                </div>

                {/* 4. SATIR: Aksiyonlar */}
                <div style={{ display: "flex", gap: "10px", marginTop: "2px" }}>
                    <Button size="small" style={{ flex: 1, fontSize: "12px" }}>İncele</Button>
                    <Button size="small" type="primary" style={{ flex: 1, fontSize: "12px" }}>Aksiyon</Button>
                </div>

            </div>
        ))}
      </div>

    </div>
  );
}

export default Component4;