import React, { useState, useEffect, useMemo } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Spin, Typography, Dropdown, Button, Modal, DatePicker } from "antd";
import { MoreOutlined, DashboardOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

function IsEmirleriTrendGrafigi({ aylikTrendler: ilkGelenVeri, loading: ilkLoading }) {
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

  // KRİTİK DÜZELTME 1: Ana filtrelerden biri (Zaman dahil) değiştiğinde local stateleri sıfırlıyoruz kanka.
  useEffect(() => {
    setLocalData(null);
    setIsCustomYearSelected(false);
    setSelectedYear(new Date().getFullYear());
  }, [ilkGelenVeri]);

  const fetchOzelTrendVerisi = async () => {
    try {
      setLocalLoading(true);
      const payload = {
        BaslangicTarihi: null, // Özel yıl seçildiği için tarihler null gidiyor kanka
        BitisTarihi: null,
        LokasyonIds: currentFilters.LokasyonIds || [],
        AtolyeIds: currentFilters.AtolyeIds || [],
        EkipmanIds: currentFilters.EkipmanIds || [],
        Yil: selectedYear,
      };

      const response = await AxiosInstance.post("GetIsEmriAnalizDashboard", payload);
      setLocalData(response?.data?.AylikTrendler || null);
    } catch (error) {
      console.error("Trend grafiği özel API hatası:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // KRİTİK DÜZELTME 2: Sadece kullanıcı içeriden bir yıl seçtiyse istek at kanka
  useEffect(() => {
    if (isCustomYearSelected && currentFilters.BaslangicTarihi && currentFilters.BitisTarihi) {
      fetchOzelTrendVerisi();
    }
  }, [selectedYear]);

  // Veri kaynağı seçimi kanka
  const aktifAylikTrendler = isCustomYearSelected && localData !== null ? localData : ilkGelenVeri;
  const aktifLoading = isCustomYearSelected ? localLoading : ilkLoading;

  const data = useMemo(() => {
    if (!aktifAylikTrendler || !Array.isArray(aktifAylikTrendler)) return [];
    return aktifAylikTrendler.map((item) => ({
      Ay: item.AyAd || "Belirsiz",
      AcilanIsEmri: item.AcilanIsEmri || 0,
      KapananIsEmri: item.KapananIsEmri || 0,
    }));
  }, [aktifAylikTrendler]);

  const renderChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
        <XAxis dataKey="Ay" axisLine={{ stroke: "#b5b5b5" }} tickLine={false} tick={{ fill: "#666", fontSize: 13 }} />
        <YAxis axisLine={{ stroke: "#b5b5b5" }} tickLine={true} tick={{ fill: "#666", fontSize: 12 }} />
        <Tooltip formatter={(value, name) => [`${value} Adet`, name]} />
        <Legend verticalAlign="bottom" height={36} iconType="rect" />
        <Bar dataKey="AcilanIsEmri" name="Toplam Maliyet" fill="#1890ff" barSize={50} radius={[6, 6, 0, 0]} />
        <Line type="monotone" dataKey="KapananIsEmri" name="Ortalama Maliyet" stroke="#52c41a" strokeWidth={3} dot={{ r: 5, stroke: "#52c41a", strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 7 }} />
      </ComposedChart>
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
            setIsCustomYearSelected(true); // Özel yıl seçildiğini işaretliyoruz
            setSelectedYear(date.year());
          }
          setIsDatePickerOpen(false);
        }}
        style={{ position: "absolute", visibility: "hidden", top: 0, right: 0 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DashboardOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              Arıza Maliyet Analizi ({isCustomYearSelected ? selectedYear : "Ana Filtre"})
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>Sütun toplam maliyet, çizgi ortalama maliyet</Text>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Dropdown menu={{ items: [{ key: "download", label: "İndir" }, { key: "year-picker", label: "Yıl Seç", onClick: () => setIsDatePickerOpen(true) }, { key: "full", label: "Tam Ekran Aç", onClick: () => setIsFullModalVisible(true) }, { key: "info", label: "Bilgi", onClick: () => setIsInfoModalVisible(true) }] }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        {aktifLoading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><Spin /></div> : renderChart()}
      </div>

      <Modal title={`İş Emirleri Trend Analizi`} open={isFullModalVisible} onCancel={() => setIsFullModalVisible(false)} footer={null} width="90%" centered destroyOnClose>
        <div style={{ height: "70vh", minHeight: "400px" }}>{renderChart()}</div>
      </Modal>
    </div>
  );
}

export default IsEmirleriTrendGrafigi;