import React, { useState } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Spin, Typography, Dropdown, Button, Modal } from "antd";
import { MoreOutlined, BuildOutlined, FullscreenOutlined, InfoCircleOutlined, DownloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

function AtolyelerIsEmriVeGecikme({ atolyeDagilimi, loading }) {
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  // Yeni JSON yapısındaki verilere göre eşleme yapıyoruz
  const data = React.useMemo(() => {
    if (!atolyeDagilimi || !Array.isArray(atolyeDagilimi)) return [];
    return atolyeDagilimi.map((item) => ({
      AtolyeTanim: item.AtolyeAd || "Belirsiz",
      IsEmriSayisi: item.IsEmriSayisi || 0,
      GecikmeOrani: item.GecikmeOrani || 0,
    }));
  }, [atolyeDagilimi]);

  // Çizgi üzerindeki noktaların tepesinde yüzde yazması için custom label
  const renderLineLabel = ({ x, y, value }) => {
    return (
      <text
        x={x}
        y={y - 12}
        fill="#874d00"
        textAnchor="middle"
        style={{ fontSize: "12px", fontWeight: "600" }}
      >
        %{value}
      </text>
    );
  };

  // Grafik yapısını fonksiyonlaştırdık, iki tarafta da (ana ekran & modal) ortak kullanılıyor kanka
  const renderChart = (height = "100%") => (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: -5, left: -15, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
        
        <XAxis 
          dataKey="AtolyeTanim" 
          axisLine={{ stroke: "#b5b5b5" }}
          tickLine={false}
          tick={{ fill: "#666", fontSize: 13 }}
        />
        
        {/* Sol Y Ekseni - İş Emri Sayısı */}
        <YAxis 
          yAxisId="left"
          axisLine={{ stroke: "#b5b5b5" }}
          tickLine={true}
          tick={{ fill: "#666", fontSize: 12 }}
        />
        
        {/* Sağ Y Ekseni - Gecikme Oranı (%) */}
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          axisLine={{ stroke: "#b5b5b5" }}
          tickLine={true}
          tickFormatter={(value) => `%${value}`}
          tick={{ fill: "#666", fontSize: 12 }}
        />
        
        <Tooltip 
          formatter={(value, name) => [
            name === "Gecikme Oranı" ? `%${value}` : `${value} Adet`, 
            name
          ]} 
        />
        
        <Legend verticalAlign="bottom" height={36} iconType="rect" />
        
        {/* İş Emri Sayısı (Sütun) */}
        <Bar 
          yAxisId="left" 
          dataKey="IsEmriSayisi" 
          name="İş Emri Sayısı" 
          fill="#1890ff" 
          barSize={55}
        />
        
        {/* Gecikme Oranı (Çizgi) */}
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="GecikmeOrani" 
          name="Gecikme Oranı" 
          stroke="#ffb703" 
          strokeWidth={3}
          dot={{ r: 5, stroke: "#ffb703", strokeWidth: 2, fill: "#fff" }} 
          activeDot={{ r: 7 }}
          label={renderLineLabel}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  // Sadece İndir, Tam Ekran Aç ve Bilgi olacak şekilde menüyü kurguladık kanka
  const menuItems = [
    { key: "download", label: "İndir"},
    { key: "full", label: "Tam Ekran Aç", onClick: () => setIsFullModalVisible(true) },
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
      {/* Üst Header Alanı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BuildOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              Atölyelere Göre İş Emri Sayısı ve Gecikme Oranı
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Sütunlar iş emri adedini, çizgi gecikme oranını gösterir
          </Text>
        </div>

        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
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

      {/* Tam Ekran Modalı kanka */}
      <Modal
        title="Atölyelere Göre İş Emri Sayısı ve Gecikme Oranı Analizi"
        open={isFullModalVisible}
        onCancel={() => setIsFullModalVisible(false)}
        footer={null}
        width="90%"
        centered
        destroyOnClose
      >
        <div style={{ height: "70vh", minHeight: "400px" }}>
          {renderChart("100%")}
        </div>
      </Modal>

      {/* Bilgi Modalı kanka */}
      <Modal
        title="Atölye Gecikme Analizi"
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsInfoModalVisible(false)}>
            Anladım
          </Button>
        ]}
      >
        <div style={{ padding: "10px 0" }}>
          {/* İstediğin Analiz İçeriği Yapısı */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Ne İşe Yarar?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Atölye bazlı iş yükü ve gecikmeleri gösterir.
              </Typography.Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Nasıl yorumlanır?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Yüksek gecikme = darboğaz veya kapasite problemi.
              </Typography.Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Ne yapmalısın?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                İş dağılımını yeniden planla veya personel artır.
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AtolyelerIsEmriVeGecikme;