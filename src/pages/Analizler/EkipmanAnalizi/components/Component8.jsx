import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spin, Typography, Select, Dropdown, Button, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Görseldeki turkuaz yeşil tonlu orijinal renk
const BAR_COLOR = "#12c2c2"; 

function YedekParcaTuketimiGrafigi({ yedekParcaTuketimi, loading }) {
  // Görseldeki sağ üst seçici filtre: "Malzeme" veya "Malzeme Tipi"
  const [breakdownType, setBreakdownType] = useState("Malzeme");
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  // API'den gelen veriyi Recharts'ın yatayda düzgünce sıralayabilmesi için mapliyoruz kanka
  const chartData = useMemo(() => {
    if (!yedekParcaTuketimi || !Array.isArray(yedekParcaTuketimi)) return [];

    // Görsel "En Çok Kullanılan 10 Parça" başlığına sahip olduğu için ilk 10 kaydı garantiliyoruz
    return yedekParcaTuketimi.slice(0, 10).map((item) => ({
      name: item.MalzemeAdi || item.MalzemeTipiAdi || item.Adi || "",
      miktar: item.TuketimMiktari || 0,
    }));
  }, [yedekParcaTuketimi]);

  const renderChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      {/* layout="vertical" vererek grafiği yatay (horizontal) yapıyoruz kanka */}
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
      >
        {/* Görseldeki gibi sadece dikey eksen kesikli kılavuz çizgileri kalacak şekilde ayarladım */}
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8e8e8" />
        
        {/* Yatay grafikte XAxis sayısal değerleri, YAxis ise kategorik metinleri (Malzeme adlarını) alır */}
        <XAxis 
          type="number" 
          axisLine={{ stroke: "#b5b5b5" }} 
          tickLine={false} 
          tick={{ fill: "#666", fontSize: 12 }} 
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          axisLine={{ stroke: "#b5b5b5" }} 
          tickLine={true} 
          tick={{ fill: "#666", fontSize: 12 }}
          width={150} // Uzun malzeme adlarının sola sığması için pay bırakıldı kanka
        />
        
        <Tooltip formatter={(value) => [`${value} Adet`, "Tüketim Miktarı"]} />
        
        {/* Görseldeki gibi oval köşelere sahip turkuaz barlar */}
        <Bar 
          dataKey="miktar" 
          fill={BAR_COLOR} 
          radius={[0, 6, 6, 0]} 
          barSize={20}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={BAR_COLOR} />
          ))}
        </Bar>
      </BarChart>
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
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}
    >
      {/* Üst Başlık ve Seçici Menü Kısmı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>Yedek Parça Tüketimi - En Çok Kullanılan 10 Parça</Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>Malzeme veya malzeme tipi kırılımına göre kullanım adedi</Text>
        </div>

        {/* Sağ Üst Köşedeki Dropdown ve Seçim Listesi */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Select 
            value={breakdownType} 
            onChange={(value) => setBreakdownType(value)} 
            style={{ width: 120 }} 
            size="small" 
            options={[
              { value: "Malzeme", label: "Malzeme" }, 
              { value: "MalzemeTipi", label: "Malzeme Tipi" }
            ]} 
          />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Grafik Alanı */}
      <div style={{ flex: 1, minHeight: "350px" }}>
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
        title="Yedek Parça Tüketimi Detay Görünümü" 
        open={isFullModalVisible} 
        onCancel={() => setIsFullModalVisible(false)} 
        footer={null} 
        width="90%" 
        centered 
        destroyOnClose
      >
        <div style={{ height: "70vh", minHeight: "450px" }}>{renderChart()}</div>
      </Modal>

      {/* Bilgi Açıklama Modalı */}
      <Modal
        title="Yedek Parça Tüketimi Analizi"
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsInfoModalVisible(false)}>Anladım</Button>
        ]}
      >
        <div style={{ padding: "10px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>Ne işe yarar?</Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Bakım onarım süreçlerinde en sık tüketilen sarf malzemeleri ve yedek parçaları adet bazında yatayda listeler.
              </Typography.Paragraph>
            </div>
            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>Nasıl yorumlanır?</Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                En uzun çubuklar depoda en hızlı devir hızına sahip veya kronik arızalardan dolayı sürekli değiştirilmek zorunda kalınan sarf malzemelerini gösterir.
              </Typography.Paragraph>
            </div>
            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>Ne yapmalısın?</Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                En çok kullanılan bu kritik malzemeler için emniyet stoku (min-max stok seviyeleri) kurgulamalı, tedarik süreçlerinde darboğaz yaşanmamasını sağlamalısın.
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default YedekParcaTuketimiGrafigi;