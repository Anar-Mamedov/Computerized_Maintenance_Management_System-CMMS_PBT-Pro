import React from "react";
import { Typography, Progress } from "antd";
import { DollarCircleOutlined, CarOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// Mock Veri: En Yüksek Maliyetli 4 Ekipman
// Percent değerleri en yüksek maliyete (740k) göre oranlanmıştır.
const topCostEquipment = [
  { 
    name: "Volvo A40G Damper", 
    id: "EQ-00112", 
    location: "Saha-1", 
    cost: 740980, 
    percent: 100,
    color: "#ff4d4f" // Kırmızı (En yüksek)
  },
  { 
    name: "Komatsu WA380 Loader", 
    id: "EQ-00087", 
    location: "Saha-2", 
    cost: 589250, 
    percent: 80,
    color: "#fa8c16" // Turuncu
  },
  { 
    name: "CAT 336D Ekskavatör", 
    id: "EQ-00231", 
    location: "Saha-1", 
    cost: 412600, 
    percent: 55,
    color: "#faad14" // Sarı
  },
  { 
    name: "JCB 3CX Kazıcı Yükleyici", 
    id: "EQ-00041", 
    location: "Saha-3", 
    cost: 198400, 
    percent: 27,
    color: "#1890ff" // Mavi
  },
];

function Component4() {
  
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", border: "1px solid #f0f0f0", gap: "15px" }}>
      
      {/* HEADER */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
             <div style={{ backgroundColor: "#fff0f6", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DollarCircleOutlined style={{ color: "#eb2f96", fontSize: "16px" }} />
             </div>
             <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>En Yüksek Maliyetli 4 Ekipman</Title>
        </div>
        <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
            Dönem içi toplam maliyet sıralaması
        </Text>
      </div>

      {/* LIST CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
        {topCostEquipment.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                
                {/* İkon Kutusu */}
                <div style={{ 
                    width: "40px", height: "40px", backgroundColor: "#f5f5f5", borderRadius: "8px", 
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 
                }}>
                    <CarOutlined style={{ fontSize: "18px", color: "#595959" }} />
                </div>

                {/* Detaylar */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    
                    {/* Üst Satır: İsim ve Tutar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text strong style={{ fontSize: "13px", color: "#262626" }}>{item.name}</Text>
                        <Text strong style={{ fontSize: "14px", color: "#262626" }}>
                             ₺{item.cost.toLocaleString("tr-TR")}
                        </Text>
                    </div>

                    {/* Alt Satır: ID ve Lokasyon */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                        <Text type="secondary">{item.id} • {item.location}</Text>
                    </div>

                    {/* Progress Bar (Görsel Ağırlık) */}
                    <Progress 
                        percent={item.percent} 
                        showInfo={false} 
                        size="small" 
                        strokeColor={item.color} 
                        trailColor="#f0f0f0"
                        style={{ margin: 0, lineHeight: 0 }}
                    />
                </div>
            </div>
        ))}
      </div>

    </div>
  );
}

export default Component4;