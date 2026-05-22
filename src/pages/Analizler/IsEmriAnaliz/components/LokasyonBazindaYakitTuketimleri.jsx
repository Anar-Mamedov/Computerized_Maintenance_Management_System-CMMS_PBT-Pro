import React, { useState, useEffect } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Spin, Typography, Dropdown, Button, Modal, DatePicker } from "antd";
import { MoreOutlined, DashboardOutlined, FullscreenOutlined, InfoCircleOutlined, DownloadOutlined, CalendarOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

function IsEmirleriTrendGrafigi({ aylikTrendler, loading }) {
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { setValue } = useFormContext() || {};

  // Seçilen yıl değiştikçe üst form katmanını/API parametresini güncelliyoruz kanka
  useEffect(() => {
    if (setValue) {
      setValue("Yil", selectedYear);
    }
  }, [selectedYear, setValue]);

  // Gelen veriyi eşliyoruz
  const data = React.useMemo(() => {
    if (!aylikTrendler || !Array.isArray(aylikTrendler)) return [];
    return aylikTrendler.map((item) => ({
      Ay: item.AyAd || "Belirsiz",
      AcilanIsEmri: item.AcilanIsEmri || 0,
      KapananIsEmri: item.KapananIsEmri || 0,
    }));
  }, [aylikTrendler]);

  // Grafik yapısı
  const renderChart = (height = "100%") => (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
        <XAxis 
          dataKey="Ay" 
          axisLine={{ stroke: "#b5b5b5" }}
          tickLine={false}
          tick={{ fill: "#666", fontSize: 13 }}
        />
        <YAxis 
          axisLine={{ stroke: "#b5b5b5" }}
          tickLine={true}
          tick={{ fill: "#666", fontSize: 12 }}
        />
        <Tooltip formatter={(value, name) => [`${value} Adet`, name]} />
        <Legend verticalAlign="bottom" height={36} iconType="rect" />
        <Bar 
          dataKey="AcilanIsEmri" 
          name="Açılan İş Emri" 
          fill="#1890ff" 
          barSize={50}
          radius={[6, 6, 0, 0]}
        />
        <Line 
          type="monotone" 
          dataKey="KapananIsEmri" 
          name="Kapanan İş Emri" 
          stroke="#52c41a" 
          strokeWidth={3}
          dot={{ r: 5, stroke: "#52c41a", strokeWidth: 2, fill: "#fff" }} 
          activeDot={{ r: 7 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  // Üç nokta menü elemanları
  const menuItems = [
    { 
      key: "download", 
      label: "İndir",
    },
    {
      key: "year-picker",
      label: "Yıl Seç",
      onClick: () => setIsDatePickerOpen(true),
    },
    { 
      key: "full", 
      label: "Tam Ekran Aç", 
      onClick: () => setIsFullModalVisible(true) 
    },
    { 
      key: "info", 
      label: "Bilgi", 
      onClick: () => setIsInfoModalVisible(true) 
    },
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
        position: "relative"
      }}
    >
      {/* Gizli DatePicker kanka - Menüden tetiklenince popup olarak açılacak ve tüm yılları seçtirecek */}
      <DatePicker
        picker="year"
        open={isDatePickerOpen}
        onOpenChange={(open) => setIsDatePickerOpen(open)}
        value={dayjs().year(selectedYear)}
        onChange={(date) => {
          if (date) {
            setSelectedYear(date.year());
          }
          setIsDatePickerOpen(false);
        }}
        style={{ position: "absolute", visibility: "hidden", top: 0, right: 0 }}
      />

      {/* Üst Başlık Kısmı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DashboardOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              İş Emirleri Trend Grafiği ({selectedYear})
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Sütun açılan, çizgi kapanan iş emirlerini gösterir
          </Text>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
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
        title={`İş Emirleri Trend Analizi - ${selectedYear}`}
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

      {/* Bilgi Modalı */}
      <Modal
  title="Trend Analizi"
  open={isInfoModalVisible}
  onCancel={() => setIsInfoModalVisible(false)}
  footer={[
    <Button key="ok" type="primary" onClick={() => setIsInfoModalVisible(false)}>
      Anladım
    </Button>
  ]}
>
  <div style={{ padding: "10px 0" }}>

    {/* Trend Analizi ve Yorumlama Kurgusu */}
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <Text strong style={{ display: "block", marginBottom: "2px" }}>
          Ne İşe Yarar?
        </Text>
        <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
          Açılan ve kapanan iş emirlerini karşılaştırır.
        </Typography.Paragraph>
      </div>

      <div>
        <Text strong style={{ display: "block", marginBottom: "2px" }}>
          Nasıl Yorumlanır?
        </Text>
        <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
          Açılan - kapanan ise backlog büyür.
        </Typography.Paragraph>
      </div>

      <div>
        <Text strong style={{ display: "block", marginBottom: "2px" }}>
          Ne Yapmalısın?
        </Text>
        <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
          İş kapatma hızını artıracak aksiyon al.
        </Typography.Paragraph>
      </div>
    </div>
  </div>
</Modal>
    </div>
  );
}

export default IsEmirleriTrendGrafigi;