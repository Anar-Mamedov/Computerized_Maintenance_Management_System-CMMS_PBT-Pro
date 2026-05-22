import React, { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spin, Typography, Select, Dropdown, Button, Modal, DatePicker } from "antd";
import { MoreOutlined, BarChartOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

function AylaraGoreIsEmriAnalizi({ aylikTrendler: ilkGelenVeri, loading: ilkLoading }) {
  const [metricType, setMetricType] = useState("Sayi");
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [localData, setLocalData] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  // Kullanıcı grafik içinden özel yıl seçti mi kontrolü kanka
  const [isCustomYearSelected, setIsCustomYearSelected] = useState(false);

  const formContext = useFormContext();
  const currentFilters = formContext ? formContext.watch() : {};

  // KRİTİK DÜZELTME 1: Ana filtrelerden biri (Zaman dahil) değiştiğinde, 
  // grafik içindeki özel yıl seçimini iptal edip ana veriye geri dönüyoruz kanka.
  useEffect(() => {
    setLocalData(null);
    setIsCustomYearSelected(false);
    setSelectedYear(new Date().getFullYear());
  }, [ilkGelenVeri]);

  const fetchOzelGrafikVerisi = async () => {
    try {
      setLocalLoading(true);
      const payload = {
        BaslangicTarihi: null, // Sadece bu grafik için özel yıl seçildiğinde tarihler null gider
        BitisTarihi: null,
        LokasyonIds: currentFilters.LokasyonIds || [],
        AtolyeIds: currentFilters.AtolyeIds || [],
        EkipmanIds: currentFilters.EkipmanIds || [],
        Yil: selectedYear,
      };

      const response = await AxiosInstance.post("GetIsEmriAnalizDashboard", payload);
      setLocalData(response?.data?.AylikTrendler || null);
    } catch (error) {
      console.error("Grafik özel API hatası:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // KRİTİK DÜZELTME 2: Sadece kullanıcı içeriden bir yıl seçtiyse istek at kanka, 
  // yoksa ana filtre değişimlerinde burası mükerrer (çift) istek atıyordu.
  useEffect(() => {
    if (isCustomYearSelected && currentFilters.BaslangicTarihi && currentFilters.BitisTarihi) {
      fetchOzelGrafikVerisi();
    }
  }, [selectedYear]);

  // Veri kaynağı seçimi: Kullanıcı özel yıl seçtiyse localData, yoksa ana filtreden gelen veri kanka
  const aktifAylikTrendler = isCustomYearSelected && localData !== null ? localData : ilkGelenVeri;
  const aktifLoading = isCustomYearSelected ? localLoading : ilkLoading;

  const chartData = useMemo(() => {
    if (!aktifAylikTrendler || !Array.isArray(aktifAylikTrendler)) return [];

    return aktifAylikTrendler.map((item) => {
      let grafikDegeri = 0;
      if (metricType === "Sayi") grafikDegeri = item.AcilanIsEmri || 0;
      else if (metricType === "Sure") grafikDegeri = item.ToplamSureSaat || 0;
      else if (metricType === "Maliyet") grafikDegeri = item.ToplamMaliyet || 0;

      return { Ay: item.AyAd, Deger: grafikDegeri };
    });
  }, [aktifAylikTrendler, metricType]);

  const renderCustomBarLabel = ({ x, y, width, value }) => {
    let formattedValue = value;
    if (metricType === "Maliyet") formattedValue = `₺${value.toLocaleString("tr-TR")}`;
    else if (metricType === "Sure") formattedValue = `${value} sa`;

    return (
      <text x={x + width / 2} y={y - 8} fill="#555" textAnchor="middle" dominantBaseline="bottom" style={{ fontSize: "12px", fontWeight: "600" }}>
        {formattedValue}
      </text>
    );
  };

  const renderChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 25, right: 10, left: -15, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
        <XAxis dataKey="Ay" axisLine={{ stroke: "#b5b5b5" }} tickLine={false} tick={{ fill: "#666", fontSize: 13 }} />
        <YAxis axisLine={{ stroke: "#b5b5b5" }} tickLine={true} tick={{ fill: "#666", fontSize: 12 }} />
        <Tooltip formatter={(value) => [metricType === "Maliyet" ? `₺${value.toLocaleString("tr-TR")}` : metricType === "Sure" ? `${value} Saat` : `${value} Adet`, metricType === "Sayi" ? "İş Emri Sayısı" : metricType === "Sure" ? "Toplam Süre" : "Toplam Maliyet"]} />
        <Bar dataKey="Deger" radius={[6, 6, 0, 0]} label={renderCustomBarLabel}>
          {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill="#1890ff" />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "10px", backgroundColor: "white", display: "flex", flexDirection: "column", padding: "15px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "relative" }}>
      <DatePicker
        picker="year"
        open={isDatePickerOpen}
        onOpenChange={(open) => setIsDatePickerOpen(open)}
        value={dayjs().year(selectedYear)}
        onChange={(date) => {
          if (date) {
            setIsCustomYearSelected(true); // İçeriden yıl seçildiğini işaretliyoruz kanka
            setSelectedYear(date.year());
          }
          setIsDatePickerOpen(false);
        }}
        style={{ position: "absolute", visibility: "hidden", top: 0, right: 0 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px", position: "relative", zIndex: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BarChartOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              Aylara Göre İş Emri Analizi ({isCustomYearSelected ? selectedYear : "Ana Filtre"})
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>Aylık iş emri sayısı, süresi veya maliyeti</Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Select value={metricType} onChange={(value) => setMetricType(value)} style={{ width: 140 }} size="small" options={[{ value: "Sayi", label: "İş Emri Sayısı" }, { value: "Sure", label: "İş Emri Süresi" }, { value: "Maliyet", label: "İş Emri Maliyeti" }]} />
          <Dropdown menu={{ items: [{ key: "download", label: "İndir" }, { key: "year-picker", label: "Yıl Seç", onClick: () => setIsDatePickerOpen(true) }, { key: "fullscreen", label: "Tam Ekran Aç", onClick: () => setIsFullModalVisible(true) }, { key: "info", label: "Bilgi", onClick: () => setIsInfoModalVisible(true) }] }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>
        {aktifLoading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><Spin /></div> : renderChart()}
      </div>

      <Modal title={`Aylara Göre İş Emri Analizi - Detaylı Görünüm`} open={isFullModalVisible} onCancel={() => setIsFullModalVisible(false)} footer={null} width="90%" centered destroyOnClose>
        <div style={{ height: "70vh", minHeight: "400px" }}>{renderChart()}</div>
      </Modal>
    </div>
  );
}

export default AylaraGoreIsEmriAnalizi;