import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Modal, Button } from "antd";
import { ExpandOutlined } from "@ant-design/icons";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BFF",
  "#FF6B8A",
  "#FFB6C1",
  "#7B68EE",
  "#20B2AA",
];

const TalepDurumDagilimi = ({ talepDurumlari = [] }) => {
  const [open, setOpen] = useState(false);
  const defaultHidden = ["Kapanmış Talepler"];
  const [activeKeys, setActiveKeys] = useState([]);

  // İlk yüklemede varsayılanları ayarla
  useEffect(() => {
    if (talepDurumlari.length > 0) {
      setActiveKeys(
        talepDurumlari
          .filter((d) => !defaultHidden.includes(d.Durum))
          .map((d) => d.Durum)
      );
    }
  }, [talepDurumlari]);

  // Renklerin sabit kalması için yardımcı fonksiyon
  const getColorForStatus = useCallback(
    (durum) => {
      const index = talepDurumlari.findIndex((d) => d.Durum === durum);
      return index >= 0 ? COLORS[index % COLORS.length] : "#8884d8";
    },
    [talepDurumlari]
  );

  const toggleLegend = (data) => {
    const { value } = data;

    // "Tümü" butonu bir RESET görevi görecek.
    // Eğer bazıları gizliyse hepsini geri getirir.
    if (value === "Tümü") {
      setActiveKeys(talepDurumlari.map((d) => d.Durum));
      return;
    }

    // Diğerlerine tıklanırsa listeden tamamen çıkar (sil)
    if (activeKeys.includes(value)) {
      setActiveKeys(activeKeys.filter((key) => key !== value));
    }
  };

  // Sadece aktif olanları grafikte göster
  const processedData = talepDurumlari.filter((d) =>
    activeKeys.includes(d.Durum)
  );

  // --- LEJANT MANTIĞI BURADA DEĞİŞTİ ---
  // Lejantta sadece "Tümü" ve "activeKeys" içinde olanları gösteriyoruz.
  // Filtrelendiği için ekrandan kaybolacaklar.
  const dynamicLegendPayload = [
    { 
      id: "Tümü", 
      value: "Tümü", 
      type: "square", 
      color: "#555555" // Tümü butonu sabit renk
    },
    ...talepDurumlari
      .filter((item) => activeKeys.includes(item.Durum)) // Sadece aktif olanları lejanta ekle
      .map((item) => ({
        id: item.Durum,
        value: item.Durum,
        type: "square",
        color: getColorForStatus(item.Durum), // Sabit renk fonksiyonunu kullan
      })),
  ];

  const renderChart = (isModal = false) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <ReTooltip formatter={(value, name) => [`${value} Adet`, name]} />
        <Legend
          verticalAlign="bottom"
          height={36}
          onClick={toggleLegend}
          payload={dynamicLegendPayload} // Dinamik payload kullanıyoruz
        />
        <Pie
          data={processedData}
          dataKey="Adet"
          nameKey="Durum"
          cx="50%"
          cy="50%"
          outerRadius={isModal ? 150 : 100}
          innerRadius={isModal ? 30 : 20}
          labelLine={isModal}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(1)}%`
          }
        >
          {processedData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              // Rengi entry.Durum'a göre çekiyoruz, böylece kayma olmuyor
              fill={getColorForStatus(entry.Durum)}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <>
      {/* Küçük kart versiyonu */}
      <div style={{ width: "100%", height: 280, position: "relative" }}>
        <Button
          type="text"
          icon={<ExpandOutlined />}
          onClick={() => setOpen(true)}
          style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
        />
        {renderChart(false)}
      </div>

      {/* Modal içindeki büyük versiyon */}
      <Modal
        title="Malzeme Talepleri Durum Dağılımı (Detaylı Görünüm)"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <div style={{ width: "100%", height: 500 }}>{renderChart(true)}</div>
      </Modal>
    </>
  );
};

export default TalepDurumDagilimi;