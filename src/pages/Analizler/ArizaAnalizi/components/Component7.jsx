import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Spin, Typography, Radio, Dropdown, Button, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Grafik Renk Paleti - Orijinal haliyle korundu
const COLORS = ["#007bff", "#ff4d4f", "#ffc107", "#17a2b8", "#28a745", "#a463bf", "#6f42c1"];

function IsEmriDagilimGrafigi({ tipDagilimi, durumDagilimi, loading }) {
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  // Hangi tabın aktif olduğunu tutan state ("Tip" veya "Durum")
  const [activeTab, setActiveTab] = useState("Tip");

  // Aktif sekmeye göre ham API verisini seçip mapliyoruz
  const chartData = React.useMemo(() => {
    const rawData = activeTab === "Tip" ? tipDagilimi : durumDagilimi;
    
    if (!rawData || !Array.isArray(rawData)) return [];
    
    return rawData.map((item) => ({
      name: item.Tanim || item.Tanim || item.Tanim || "", 
      value: item.Adet || 0,         
      percentage: item.Yuzde || 0,   
    }));
  }, [tipDagilimi, durumDagilimi, activeTab]);

  // Hem ana ekranda hem modalda ortak kullanılacak seçici buton yapısı kanka
  const renderTabSelector = () => (
    <Radio.Group 
      value={activeTab} 
      onChange={(e) => setActiveTab(e.target.value)} 
      size="small" 
      buttonStyle="solid"
    >
      <Radio.Button value="Tip">Arıza Nedeni</Radio.Button>
      <Radio.Button value="Durum">Arıza Tipi</Radio.Button>
    </Radio.Group>
  );

  // Özel Label Çizimi - Yüzdesel büyümede taşma yapmaması için mesafe dinamikleştirildi
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name, percentage }) => {
    const RADIAN = Math.PI / 180;
    // Sabit 30px yerine outerRadius'un %15'i kadar dışarı atıyoruz ki büyük ekranda iç içe girmesin
    const radius = outerRadius + (typeof outerRadius === 'number' ? 30 : outerRadius * 0.15); 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="#666" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" style={{ fontSize: "12px" }}>
        {`${name}: ${value} (%${percentage})`}
      </text>
    );
  };

  // Kanka burayı dinamik yüzdelere çektik, varsayılan olarak kabın durumuna göre ölçeklenecek
  const renderChart = (inner = "40%", outer = "65%") => (
    <ResponsiveContainer width="100%" height="105%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={inner}
          outerRadius={outer}
          paddingAngle={4}
          dataKey="value"
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value, name, props) => [`${value} Adet (%${props.payload.percentage})`, name]} />
      </PieChart>
    </ResponsiveContainer>
  );

  // Menü elemanları
  const menuItems = [
    { key: "download", label: "İndir" },
    { key: "fullscreen", label: "Tam Ekran Aç", onClick: () => setIsFullModalVisible(true) },
    { key: "info", label: "Bilgi", onClick: () => setIsInfoModalVisible(true) },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header Kısmı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>Arıza Nedenleri Dağılımı</Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Arıza nedeni veya arıza tipine göre adet ve oran
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {renderTabSelector()}
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Grafik Alanı */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1, marginTop: "20px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin />
          </div>
        ) : (
          /* Ana ekranda kabın %40 iç, %65 dış genişliğini kaplayarak tatlı bir büyüklük sunar */
          renderChart("40%", "65%") 
        )}
      </div>

      {/* Tam Ekran Modalı */}
      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "30px" }}>
            <span>İş Emri Dağılım Grafiği</span>
            {renderTabSelector()}
          </div>
        }
        open={isFullModalVisible}
        onCancel={() => setIsFullModalVisible(false)}
        footer={null}
        width="90%"
        centered
        destroyOnClose
      >
        <div style={{ height: "70vh", minHeight: "500px", paddingTop: "20px" }}>
          {/* Modal kocaman olacağı için yine yüzdesel veriyoruz, devasa monitörde de dev gibi açılır */}
          {renderChart("45%", "70%")} 
        </div>
      </Modal>

      {/* Bilgi Modalı */}
      <Modal
        title="İş Emri Dağılım Grafiği"
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsInfoModalVisible(false)}>Anladım</Button>
        ]}
      >
        <div style={{ padding: "10px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Ne işe yarar?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Arıza nedenlerinin toplam arızalar içindeki dağılımını gösterir.
              </Typography.Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Nasıl yorumlanır?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                En sık tekrar eden kök nedenleri tespit etmek için kullanılır.
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default IsEmriDagilimGrafigi;