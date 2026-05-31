import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spin, Typography, Select, Dropdown, Button, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

function EkipmanBazliMaliyetDagilimi({ maliyetDagilimi, loading }) {
  // Görseldeki sağ üst seçici: "Ekipman" veya "Ekipman Tipi"
  const [breakdownType, setBreakdownType] = useState("Ekipman");
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  // API'den gelen veriyi Recharts'ın yatayda okuyabileceği formata sokuyoruz kanka
  const chartData = useMemo(() => {
    if (!maliyetDagilimi || !Array.isArray(maliyetDagilimi)) return [];

    // Grafikte kalabalık yapmaması için gelen ilk 5-6 veriyi listelemek görseldeki tasarıma tam uyar
    return maliyetDagilimi.slice(0, 6).map((item) => ({
      // API'den gelen EkipmanKodu veya gelebilecek EkipmanTipiAdi alanlarını esnek karşılıyoruz
      name: item.EkipmanKodu || item.EkipmanTipiAdi || item.Adi || "",
      maliyet: item.ToplamMaliyet || 0,
    }));
  }, [maliyetDagilimi]);

  // Yatay grafikte değerleri barların sağ tarafında veya Tooltip'te formatlamak için yardımcı fonksiyon
  const formatMaliyet = (value) => `₺${value.toLocaleString("tr-TR")}`;

  const renderChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      {/* layout="vertical" vererek grafiği yatay (horizontal) hale getiriyoruz kanka */}
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 40, left: 20, bottom: 10 }}
      >
        {/* Görseldeki gibi sadece dikey eksen çizgileri kalacak şekilde ayarladım */}
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8e8e8" />
        
        {/* Yatay grafikte XAxis sayısal değerleri, YAxis ise isimleri (KMP-042 vb.) alır */}
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
          width={80}
        />
        
        <Tooltip formatter={(value) => [formatMaliyet(value), "Toplam Maliyet"]} />
        
        {/* Görseldeki gibi köşeleri oval (radius) tatlı mavi barlar */}
        <Bar 
          dataKey="maliyet" 
          fill="#1890ff" 
          radius={[0, 6, 6, 0]} 
          barSize={24}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill="#1890ff" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

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
        position: "relative" 
      }}
    >
      {/* Üst Başlık ve Seçici Menü Alanı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px", position: "relative", zIndex: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>Ekipman Bazlı Maliyet Dağılımı</Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>Maliyetin ekipman veya ekipman tipi kırılımında dağılımı</Text>
        </div>

        {/* Sağ Üst Köşedeki Filtre ve Dropdown Yapısı */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Select 
            value={breakdownType} 
            onChange={(value) => setBreakdownType(value)} 
            style={{ width: 120 }} 
            size="small" 
            options={[
              { value: "Ekipman", label: "Ekipman" }, 
              { value: "EkipmanTipi", label: "Ekipman Tipi" }
            ]} 
          />
          <Dropdown 
            menu={{ 
              items: [
                { key: "download", label: "İndir" }, 
                { key: "fullscreen", label: "Tam Ekran Aç", onClick: () => setIsFullModalVisible(true) }, 
                { key: "info", label: "Bilgi", onClick: () => setIsInfoModalVisible(true) }
              ] 
            }} 
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Grafik Çizim Alanı */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin />
          </div>
        ) : (
          renderChart()
        )}
      </div>

      {/* Tam Ekran Detay Görünüm Modalı */}
      <Modal 
        title="Ekipman Bazlı Maliyet Dağılımı - Detaylı Görünüm" 
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
        title="Ekipman Bazlı Maliyet Dağılımı"
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
                Hangi ekipmanın veya hangi ürün grubunun işletmeye ne kadar bakım/onarım maliyeti çıkardığını yatayda kıyaslamanızı sağlar.
              </Typography.Paragraph>
            </div>
            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>Nasıl yorumlanır?</Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                En uzun çubuklar en çok bütçe tüketen "kara delik" ekipmanları temsil eder.
              </Typography.Paragraph>
            </div>
            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>Ne yapmalısın?</Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Listenin en başındaki yüksek maliyetli ekipmanlar için kök neden analizi (RCA) yapıp kronik harcamaları durdurmalısın.
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EkipmanBazliMaliyetDagilimi;