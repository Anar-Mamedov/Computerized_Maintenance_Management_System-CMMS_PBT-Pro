import React, { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spin, Typography, Select, Dropdown, Button, Modal, DatePicker } from "antd";
import { MoreOutlined, BarChartOutlined, FullscreenOutlined, InfoCircleOutlined, DownloadOutlined, CalendarOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form"; // API senkronizasyonu için eklendi kanka
import dayjs from "dayjs";

const { Text } = Typography;

function AylaraGoreIsEmriAnalizi({ aylikTrendler, loading }) {
  const [metricType, setMetricType] = useState("Sayi"); // Sayi, Sure, Maliyet
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

  // Kullanıcının seçtiği filtreye göre veriyi mapliyoruz kanka
  const chartData = useMemo(() => {
    if (!aylikTrendler || !Array.isArray(aylikTrendler)) return [];

    return aylikTrendler.map((item) => {
      let grafikDegeri = 0;

      if (metricType === "Sayi") {
        grafikDegeri = item.AcilanIsEmri || 0;
      } else if (metricType === "Sure") {
        grafikDegeri = item.ToplamSureSaat || 0;
      } else if (metricType === "Maliyet") {
        grafikDegeri = item.ToplamMaliyet || 0;
      }

      return {
        Ay: item.AyAd,
        Deger: grafikDegeri,
      };
    });
  }, [aylikTrendler, metricType]);

  // Barın tepesinde çıkan değerlerin tasarımı kanka
  const renderCustomBarLabel = ({ x, y, width, value }) => {
    let formattedValue = value;
    if (metricType === "Maliyet") {
      formattedValue = `₺${value.toLocaleString("tr-TR")}`;
    } else if (metricType === "Sure") {
      formattedValue = `${value} sa`;
    }

    return (
      <text 
        x={x + width / 2} 
        y={y - 8} 
        fill="#555" 
        textAnchor="middle" 
        dominantBaseline="bottom"
        style={{ fontSize: "12px", fontWeight: "600" }}
      >
        {formattedValue}
      </text>
    );
  };

  // Grafik iskeletini fonksiyonlaştırdık ki katman çakışması yapmasın ve modolda da açılabilsin
  const renderChart = (height = "100%") => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 25, right: 10, left: -15, bottom: 5 }}>
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
        <Tooltip 
          formatter={(value) => [
            metricType === "Maliyet" ? `₺${value.toLocaleString("tr-TR")}` : metricType === "Sure" ? `${value} Saat` : `${value} Adet`, 
            metricType === "Sayi" ? "İş Emri Sayısı" : metricType === "Sure" ? "Toplam Süre" : "Toplam Maliyet"
          ]} 
        />
        <Bar 
          dataKey="Deger" 
          radius={[6, 6, 0, 0]} 
          label={renderCustomBarLabel}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill="#1890ff" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const menuItems = [
    { key: "download", label: "İndir" },
    {
      key: "year-picker",
      label: "Yıl Seç",
      onClick: () => setIsDatePickerOpen(true), // Menüden tıklandığında gizli takvimi açıyoruz
    },
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
        position: "relative"
      }}
    >
      {/* Gizli Yıl Seçici Takvim Bileşeni kanka */}
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

      {/* Üst Başlık ve Seçim Alanı - Tıklama sorunu için zIndex ve relative eklendi kanka */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px", position: "relative", zIndex: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BarChartOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              Aylara Göre İş Emri Analizi ({selectedYear})
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Aylık iş emri sayısı, süresi veya maliyeti
          </Text>
        </div>

        {/* Katman ezilmesi engellenen buton sarmalayıcısı */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
          <Select
            value={metricType}
            onChange={(value) => setMetricType(value)}
            style={{ width: 140 }}
            size="small"
            options={[
              { value: "Sayi", label: "İş Emri Sayısı" },
              { value: "Sure", label: "İş Emri Süresi" },
              { value: "Maliyet", label: "İş Emri Maliyeti" },
            ]}
          />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Grafik Çizim Alanı */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>
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
        title={`Aylara Göre İş Emri Analizi - Detaylı Görünüm (${selectedYear})`}
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
        title="Aylara Göre İş Emri Analizi"
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
                Aylara göre iş yükü, süre veya maliyet trendini gösterir.
              </Typography.Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Nasıl yorumlanır?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Ani artışlar operasyonel yoğunluk veya arıza artışı anlamına gelir.
              </Typography.Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>
                Ne Yapmalısın?
              </Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Yoğun dönemler için kapasite planlaması yap.
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AylaraGoreIsEmriAnalizi;