import React from "react";
import { Typography } from "antd";
import { 
  FireOutlined, 
  DashboardOutlined, 
  ToolOutlined, 
  ShopOutlined, 
  BulbOutlined 
} from "@ant-design/icons";

const { Text, Title } = Typography;

function Component4() {
  
  // Metrik Kartı Bileşeni (Tekrar kullanımı için)
  const MetricItem = ({ icon, color, title, value, subText }) => (
    <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        padding: "15px", 
        backgroundColor: "#fafafa", 
        borderRadius: "8px",
        border: "1px solid #f0f0f0"
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
            <div style={{ 
                backgroundColor: "white", 
                borderRadius: "50%", 
                width: "32px", 
                height: "32px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                color: color
            }}>
                {icon}
            </div>
            <Text type="secondary" style={{ fontSize: "12px", fontWeight: "500" }}>{title}</Text>
        </div>
        
        <div>
            <Text strong style={{ fontSize: "20px", color: "#262626", display: "block", lineHeight: "1.2" }}>{value}</Text>
            <Text type="secondary" style={{ fontSize: "11px" }}>{subText}</Text>
        </div>
    </div>
  );

  return (
    <div style={{ 
        width: "100%", 
        height: "100%", 
        backgroundColor: "white", 
        borderRadius: "10px", 
        padding: "20px", 
        display: "flex", 
        flexDirection: "column", 
        border: "1px solid #f0f0f0", 
        gap: "15px" 
    }}>
      
      {/* HEADER */}
      <div>
        <Title level={4} style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Hızlı Özet</Title>
      </div>

      {/* METRICS GRID (2x2) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", flex: 1 }}>
        
        {/* 1. Yakıt */}
        <MetricItem 
            icon={<FireOutlined />} 
            color="#ff4d4f" 
            title="Ortalama Yakıt" 
            value="19.6 L/sa" 
            subText="Aktif ekipmanlar" 
        />

        {/* 2. Kullanım */}
        <MetricItem 
            icon={<DashboardOutlined />} 
            color="#1890ff" 
            title="Ortalama Kullanım" 
            value="67%" 
            subText="Aktif ekipmanlar" 
        />

        {/* 3. Bakımda */}
        <MetricItem 
            icon={<ToolOutlined />} 
            color="#fa8c16" 
            title="Bakımda" 
            value="1" 
            subText="Planlı / arıza" 
        />

        {/* 4. Serviste */}
        <MetricItem 
            icon={<ShopOutlined />} 
            color="#722ed1" 
            title="Serviste" 
            value="1" 
            subText="Dış servis" 
        />

      </div>

      {/* FOOTER: SMART NOTE */}
      <div style={{ 
          backgroundColor: "#f9f0ff", 
          border: "1px solid #d3adf7", 
          borderRadius: "8px", 
          padding: "10px", 
          display: "flex", 
          gap: "10px",
          alignItems: "flex-start"
      }}>
          <BulbOutlined style={{ color: "#722ed1", fontSize: "16px", marginTop: "2px" }} />
          <div>
              <Text strong style={{ fontSize: "12px", color: "#531dab", display: "block" }}>Akıllı Not</Text>
              <Text style={{ fontSize: "11px", color: "#595959", lineHeight: "1.3" }}>
                  İlk 2 maliyetli ekipman <b>toplam YTD maliyetin</b> büyük kısmını taşıyor. (Örn: parça + dış servis)
              </Text>
          </div>
      </div>

    </div>
  );
}

export default Component4;