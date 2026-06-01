import React, { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Spin, Typography, Dropdown, Button, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Görseldeki orijinal renk paleti
const BAR_COLOR = "#1890ff"; // Arıza Sayısı (Mavi)
const LINE_COLOR = "#52c41a"; // Ekipman Sayısı (Yeşil)

function EkipmanArizaSikligiGrafigi({ yasDagilimi, loading }) {
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  // API'den gelen dinamik veriyi mapliyoruz kanka
  const chartData = React.useMemo(() => {
    if (!yasDagilimi || !Array.isArray(yasDagilimi)) return [];
    return yasDagilimi.map((item) => ({
      name: item.YasGrubu || item.Adi || "",
      ariza: item.ArizaSayisi ?? 0,
      ekipman: item.EkipmanSayisi ?? 0,
    }));
  }, [yasDagilimi]);

  // Grafik Çizim Fonksiyonu
  const renderChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 25, right: 20, bottom: 20, left: 10 }}
      >
        {/* Üstteki kesikli çizgiler */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
        
        {/* X Ekseni - Yaş Grupları */}
        <XAxis 
          dataKey="name" 
          tickLine={false} 
          stroke="#666"
          dy={10}
        />

        {/* Sol Y Ekseni - Arıza Sayısı (Dinamik ölçekleme için domain kaldırıldı kanka) */}
        <YAxis
          yAxisId="left"
          orientation="left"
          stroke="#666"
          tickLine={false}
          allowDecimals={false}
        />

        {/* Sağ Y Ekseni - Ekipman Sayısı (Dinamik ölçekleme için domain kaldırıldı kanka) */}
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#666"
          tickLine={false}
          allowDecimals={false}
        />

        {/* Mouse ile üzerine gelindiğinde gözükecek bilgi kutucuğu */}
        <Tooltip 
          formatter={(value, name) => [
            value, 
            name === "ariza" ? "Arıza Sayısı" : "Ekipman Sayısı"
          ]}
        />

        {/* Alt Kısımdaki Göstergeler (Legend) */}
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="rect"
          formatter={(value) => (
            <span style={{ color: value === "ariza" ? BAR_COLOR : LINE_COLOR, fontWeight: 500 }}>
              {value === "ariza" ? "Arıza Sayısı" : "Ekipman Sayısı"}
            </span>
          )}
        />

        {/* Sütun Grafiği - Arıza Sayısı (Sol Eksen) */}
        <Bar
          yAxisId="left"
          dataKey="ariza"
          fill={BAR_COLOR}
          barSize={50} // Veri az olduğunda barlar çok kalın olmasın diye ideal boyuta çekildi
          radius={[4, 4, 0, 0]}
          label={{ position: "top", fill: "#333", fontSize: 12, offset: 8 }}
        />

        {/* Çizgi Grafiği - Ekipman Sayısı (Sağ Eksen) */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="ekipman"
          stroke={LINE_COLOR}
          strokeWidth={3}
          dot={{ r: 5, fill: "#fff", stroke: LINE_COLOR, strokeWidth: 3 }}
          activeDot={{ r: 7 }}
          label={{ position: "top", fill: "#333", fontSize: 12, offset: 10 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>Ekipman Yaşlarına Göre Arıza Sıklığı</Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Yaş gruplarına göre arıza adedi ve ekipman sayısı
          </Text>
        </div>

        <div>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Grafik Alanı */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin />
          </div>
        ) : (
          renderChart()
        )}
      </div>

      {/* Tam Ekran Modalı */}
      <Modal
        title="Ekipman Yaşlarına Göre Arıza Sıklığı"
        open={isFullModalVisible}
        onCancel={() => setIsFullModalVisible(false)}
        footer={null}
        width="90%"
        centered
        destroyOnClose
      >
        <div style={{ height: "70vh", minHeight: "400px" }}>
          {renderChart()}
        </div>
      </Modal>

      {/* Bilgi Modalı */}
      <Modal
        title="Ekipman Yaşlarına Göre Arıza Sıklığı"
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
                Farklı yaş gruplarındaki ekipmanların toplam arıza sayılarını ve o yaş grubunda kaç adet aktif ekipman bulunduğunu kıyaslamanızı sağlar.
              </Typography.Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Nasıl yorumlanır?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Ekipman sayısı az olmasına rağmen arıza sayısı dikey olarak fırlıyorsa, bu yaş grubundaki ekipmanların ekonomik ömrünü tamamladığı veya bakım maliyetlerinin arttığı yorumu yapılabilir.
              </Typography.Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Ne yapmalısın?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Arıza frekansı kronikleşen yaş grupları için revizyon (overhaul) planları yapmalı ya da yeni ekipman yatırımı planlamalısın.
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EkipmanArizaSikligiGrafigi;