import React, { useState, useEffect, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Spin, Typography, Dropdown, Button, Modal, DatePicker } from "antd";
import { MoreOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

function LokasyonBazliIsEmriHaritasi({ lokasyonHaritasi: ilkGelenVeri, loading: ilkLoading }) {
  const [isFullModalVisible, setIsFullModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [localData, setLocalData] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [isCustomYearSelected, setIsCustomYearSelected] = useState(false);

  const formContext = useFormContext();
  const currentFilters = formContext ? formContext.watch() : {};

  useEffect(() => {
    setLocalData(null);
    setIsCustomYearSelected(false);
    setSelectedYear(new Date().getFullYear());
  }, [ilkGelenVeri]);

  const fetchOzelHaritaVerisi = async () => {
    try {
      setLocalLoading(true);
      const payload = {
        BaslangicTarihi: null,
        BitisTarihi: null,
        LokasyonIds: currentFilters.LokasyonIds || [],
        AtolyeIds: currentFilters.AtolyeIds || [],
        EkipmanIds: currentFilters.EkipmanIds || [],
        Yil: selectedYear,
      };

      const response = await AxiosInstance.post("GetIsEmriAnalizDashboard", payload);
      setLocalData(response?.data?.LokasyonHaritasi || null);
    } catch (error) {
      console.error("Harita grafiği özel API hatası:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (isCustomYearSelected && currentFilters.BaslangicTarihi && currentFilters.BitisTarihi) {
      fetchOzelHaritaVerisi();
    }
  }, [selectedYear]);

  const aktifHaritaVerisi = isCustomYearSelected && localData !== null ? localData : ilkGelenVeri;
  const aktifLoading = isCustomYearSelected ? localLoading : ilkLoading;

  // Veriyi Recharts Scatter formatına dönüştürüyoruz kanka
  const data = useMemo(() => {
    if (!aktifHaritaVerisi || !Array.isArray(aktifHaritaVerisi)) return [];
    return aktifHaritaVerisi.map((item) => ({
      x: item.X || 0,
      y: item.Y || 0,
      name: item.LokasyonAdi || "Bilinmeyen Lokasyon",
      isEmri: item.IsEmriSayisi || 0,
      ariza: item.ArizaSayisi || 0,
      maliyet: item.Maliyet || 0,
    }));
  }, [aktifHaritaVerisi]);

  // Görseldeki gibi noktaların üzerine Lokasyon Adı ve İş Emri Sayısı basan özel etiket yapısı
  const renderCustomLabel = (props) => {
    const { x, y, payload } = props;
    if (!payload || !payload.name) return null;
    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={-20} textAnchor="middle" fill="#4b5563" style={{ fontSize: "12px", fontWeight: "600" }}>
          {payload.name}
        </text>
        <text dy={-6} textAnchor="middle" fill="#6b7280" style={{ fontSize: "11px" }}>
          {`${payload.isEmri} iş emri`}
        </text>
      </g>
    );
  };

  // Görseldeki gibi noktaları yuvarlak yerine çarpı (X) şeklinde çizmek için custom shape kanka
  const renderCrossShape = (props) => {
    const { cx, cy } = props;
    const size = 8; // Çarpının büyüklüğü
    
    // Görseldeki gibi iş emri yoğunluğuna göre dinamik renk atanabilir (Mavi, Kırmızı, Turuncu)
    const count = props.payload?.isEmri || 0;
    let strokeColor = "#1890ff"; // Varsayılan Mavi
    if (count > 200) strokeColor = "#ff4d4f"; // Yoğun arıza/iş yükü varsa Kırmızı
    else if (count > 80) strokeColor = "#fa8c16"; // Orta yoğunlukta Turuncu

    return (
      <path
        d={`M ${cx - size} ${cy - size} L ${cx + size} ${cy + size} M ${cx - size} ${cy + size} L ${cx + size} ${cy - size}`}
        stroke={strokeColor}
        strokeWidth={3}
        fill="none"
      />
    );
  };

  const renderChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 30, right: 30, bottom: 20, left: -10 }}>
        {/* Görseldeki hem yatay hem dikey kesikli grid çizgileri */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
        
        {/* X Ekseni (Koordinat Düzeni) */}
        <XAxis 
          type="number" 
          dataKey="x" 
          name="X Koordinatı" 
          axisLine={{ stroke: "#b5b5b5" }} 
          tickLine={false}
          tick={{ fill: "#666", fontSize: 12 }}
          domain={['auto', 'auto']}
        />
        
        {/* Y Ekseni (Koordinat Düzeni) */}
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Y Koordinatı" 
          axisLine={{ stroke: "#b5b5b5" }} 
          tickLine={false}
          tick={{ fill: "#666", fontSize: 12 }}
          domain={['auto', 'auto']}
        />
        
        {/* Üzerine gelindiğinde detayları gösteren Tooltip */}
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const item = payload[0].payload;
              return (
                <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                  <p style={{ margin: "4px 0 0" }}>İş Emri Sayısı: <strong>{item.isEmri}</strong></p>
                  <p style={{ margin: 0 }}>Arıza Sayısı: <strong>{item.ariza}</strong></p>
                  <p style={{ margin: 0 }}>Maliyet: <strong>₺{item.maliyet.toLocaleString("tr-TR")}</strong></p>
                </div>
              );
            }
            return null;
          }}
        />
        
        {/* Dağılım/Harita Noktaları */}
        <Scatter name="Lokasyonlar" data={data} shape={renderCrossShape}>
          <LabelList content={renderCustomLabel} />
        </Scatter>
      </ScatterChart>
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
            setIsCustomYearSelected(true);
            setSelectedYear(date.year());
          }
          setIsDatePickerOpen(false);
        }}
        style={{ position: "absolute", visibility: "hidden", top: 0, right: 0 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EnvironmentOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              Lokasyon Bazlı Toplam İş Emri Haritası ({isCustomYearSelected ? selectedYear : "Ana Filtre"})
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>Koordinat bazlı lokasyon ve iş emri yoğunluğu</Text>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Dropdown menu={{ items: [{ key: "download", label: "İndir" }, { key: "year-picker", label: "Yıl Seç", onClick: () => setIsDatePickerOpen(true) }, { key: "full", label: "Tam Ekran Aç", onClick: () => setIsFullModalVisible(true) }, { key: "info", label: "Bilgi", onClick: () => setIsInfoModalVisible(true) }] }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: "350px" }}>
        {aktifLoading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><Spin /></div> : renderChart()}
      </div>

      <Modal title={`Lokasyon Bazlı Toplam İş Emri Haritası`} open={isFullModalVisible} onCancel={() => setIsFullModalVisible(false)} footer={null} width="90%" centered destroyOnClose>
        <div style={{ height: "70vh", minHeight: "400px" }}>{renderChart()}</div>
      </Modal>

      {/* Bilgi Modalı */}
      <Modal
        title="Lokasyon Bazlı İş Emri Haritası"
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
                Fabrika sahasındaki veya işletme lokasyonlarındaki iş emirlerinin koordinat düzlemi üzerinde mekansal olarak nerede kümelendiğini gösterir.
              </Typography.Paragraph>
            </div>
            <div>
              <Text strong style={{ display: "block", marginBottom: "2px" }}>Nasıl yorumlanır?</Text>
              <Typography.Paragraph type="secondary" style={{ margin: 0, paddingLeft: "18px" }}>
                Kırmızı renkli veya birbirine çok yakın koordinatlarda sıkışmış noktalar, arızaların ve bakım operasyonlarının en yoğun olduğu "sıcak bölgeleri" temsil eder.
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LokasyonBazliIsEmriHaritasi;