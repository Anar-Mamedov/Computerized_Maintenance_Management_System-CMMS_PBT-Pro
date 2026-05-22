import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Spin, Typography, Radio, Dropdown, Button, Modal } from "antd";
import { MoreOutlined, FullscreenOutlined, InfoCircleOutlined, DownloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Grafik Renk Paleti - Orijinal haliyle korundu
const COLORS = ["#007bff", "#ff4d4f", "#ffc107", "#17a2b8", "#28a745", "#a463bf", "#6f42c1"];

function IsEmriDagilimGrafigi({ tipDagilimi, loading }) {
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  // Gelen ham API verisini mapliyoruz
  const chartData = React.useMemo(() => {
    if (!tipDagilimi || !Array.isArray(tipDagilimi)) return [];
    return tipDagilimi.map((item) => ({
      name: item.TipAdi,        // örn: "PERİYODİK BAKIM"
      value: item.Adet,          // örn: 3127
      percentage: item.Yuzde,    // örn: 52.9
    }));
  }, [tipDagilimi]);

  // Özel Label Çizimi - Orijinal hesaplama yapısı ve mesafesi tamamen korundu
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // 30px dışarıda çizme yapısı korundu
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="#666" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" style={{ fontSize: "12px" }}>
        {`${name}: ${value} (%${percentage})`}
      </text>
    );
  };

  // Grafik yapısını fonksiyonlaştırdık ki hem ana ekranda hem modalda temizce çizilsin kanka
  const renderChart = (inner = 45, outer = 70) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={inner}
          outerRadius={outer}
          paddingAngle={5}
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

  // Menü elemanları senin istediğin gibi kurgulandı
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
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>İş Emri Dağılım Grafiği</Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Durum veya tip seçimine göre pasta grafik
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Radio.Group value="Tip" size="small" buttonStyle="solid">
            <Radio.Button value="Tip">Tip</Radio.Button>
            <Radio.Button value="Durum">Durum</Radio.Button>
          </Radio.Group>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Grafik Alanı */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin />
          </div>
        ) : (
          renderChart(45, 70) // Ana ekran boyutları
        )}
      </div>

      {/* Tam Ekran Modalı kanka */}
      <Modal
        title="İş Emri Dağılım Grafiği"
        open={isFullModalVisible}
        onCancel={() => setIsFullModalVisible(false)}
        footer={null}
        width="90%"
        centered
        destroyOnClose
      >
        {/* Geniş ekranda grafik ezilmesin diye yarıçapları biraz büyüterek render ediyoruz */}
        <div style={{ height: "70vh", minHeight: "400px" }}>
          {renderChart(80, 130)} 
        </div>
      </Modal>

      {/* Bilgi Modalı kanka */}
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
                İş emirlerinin tip veya durum bazında dağılımını gösterir.
              </Typography.Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Nasıl yorumlanır?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Büyük dilimler operasyonel yoğunluğu gösterir. Arıza oranı yüksekse reaktif bakım artmıştır.
              </Typography.Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Ne yapmalısın?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Arıza oranı yüksekse periyodik bakım planlarını artır.
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default IsEmriDagilimGrafigi;