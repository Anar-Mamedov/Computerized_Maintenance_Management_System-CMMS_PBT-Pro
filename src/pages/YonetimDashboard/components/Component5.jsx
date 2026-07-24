import React, { useMemo, useState, useEffect } from "react";
import { Typography, Spin, message } from "antd";
import { useFormContext } from "react-hook-form";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AxiosInstance from "../../../api/http";

const { Text, Title } = Typography;

// Renk haritası (API'den gelen kategori isimlerine göre)
const categoryColors = {
  YAKIT: "#8884d8",
  BAKIM: "#82ca9d",
  PARÇA: "#ffc658",
  TAŞERON: "#ff8042",
  DİĞER: "#0088FE",
};

// Kategori etiketlerini düzgün göstermek için
const categoryLabels = {
  YAKIT: "Yakıt",
  BAKIM: "Bakım",
  PARÇA: "Parça",
  TAŞERON: "Taşeron",
  DİĞER: "Diğer",
};

const Component5 = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- FORM CONTEXT BAĞLANTISI ---
  // Üst barda yönettiğimiz filtre değerlerini anlık olarak watch ediyoruz
  const { watch } = useFormContext();
  
  const baslangicTarihi = watch("filtreBaslangicTarihi");
  const bitisTarihi = watch("filtreBitisTarihi");
  const lokasyonIds = watch("filtreLokasyonIds");
  const giderTipi = watch("filtreGiderTipi");

  // 1. API İstek Fonksiyonu
  const fetchMonthlyCosts = async () => {
    setLoading(true);
    try {
      const payload = {
        BaslangicTarihi: baslangicTarihi,
        BitisTarihi: bitisTarihi,
        LokasyonIds: lokasyonIds || [],
        GiderTipi: giderTipi || "TÜMÜ",
      };
      
      const response = await AxiosInstance.post("GetMonthlyCostGraph", payload);
      
      const resData = response?.liste
        ? response
        : response?.data?.liste
          ? response.data
          : null;

      if (resData) {
        setApiData(resData);
      } else {
        setApiData({ liste: [] });
        message.error("Maliyet verileri alınırken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Maliyet Grafiği API Hatası:", error);
      message.error("Sunucuya bağlanılamadı.");
      setApiData({ liste: [] });
    } finally {
      setLoading(false);
    }
  };

  // Filtrelerden herhangi biri değiştiğinde API otomatik tekrar tetiklenir
  useEffect(() => {
    if (baslangicTarihi && bitisTarihi) {
      fetchMonthlyCosts();
    }
  }, [baslangicTarihi, bitisTarihi, JSON.stringify(lokasyonIds), giderTipi]);

  // 2. API verisini Recharts ve İstatistikler için işle
  const { chartData, stats, totalCost, categories } = useMemo(() => {
    if (!apiData || !apiData.liste || apiData.liste.length === 0) {
      return { chartData: [], stats: [], totalCost: 0, categories: [] };
    }

    const processedData = [];
    const categoryTotals = {};
    const allCategories = new Set();
    let grandTotal = 0;

    apiData.liste.forEach((item) => {
      const row = {
        name: item.AyLabel,
        year: item.Yil,
      };

      if (item.Maliyetler && Array.isArray(item.Maliyetler)) {
        item.Maliyetler.forEach((maliyet) => {
          const catName = maliyet.Kategori.toUpperCase();
          const tutarDegeri = maliyet.Tutar || 0;

          row[catName] = tutarDegeri;
          allCategories.add(catName);

          categoryTotals[catName] = (categoryTotals[catName] || 0) + tutarDegeri;
          grandTotal += tutarDegeri;
        });
      }

      processedData.push(row);
    });

    const formattedStats = Object.keys(categoryTotals).map((cat) => ({
      label: categoryLabels[cat] || cat,
      key: cat,
      value: `₺${categoryTotals[cat].toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      color: categoryColors[cat] || "#999999",
    }));

    return {
      chartData: processedData,
      stats: formattedStats,
      totalCost: grandTotal,
      categories: Array.from(allCategories),
    };
  }, [apiData]);

  const currencyFormatter = (value) => {
    return `₺${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "350px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Spin tip="Maliyet verileri yükleniyor..." />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div style={{ padding: "4px 20px", height: "350px", backgroundColor: "white", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Text type="secondary">Belirtilen kriterlerde maliyet verisi bulunamadı.</Text>
      </div>
    );
  }

  const activeYear = chartData[0]?.year || 2026;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER KISMI */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={4} style={{ margin: 0, color: "#1f1f1f" }}>
              Yıllık Maliyet Dağılımı Grafiği
            </Title>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Aylara göre maliyet dağılımı (Yakıt/Bakım/Parça/Taşeron/Diğer)
            </Text>
          </div>
          <div
            style={{
              backgroundColor: "#f0f2f5",
              padding: "4px 12px",
              borderRadius: "6px",
              fontWeight: "600",
              color: "#595959",
            }}
          >
            {activeYear}
          </div>
        </div>
      </div>

      {/* İÇERİK KISMI */}
      <div style={{ display: "flex", flex: 1, gap: "20px", minHeight: 0 }}>
        
        {/* SOL: TOPLAM VE DETAYLAR */}
        <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "15px", overflowY: "auto" }}>
          <div style={{ padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px", borderLeft: "4px solid #1890ff" }}>
            <Text style={{ display: "block", color: "#8c8c8c", fontSize: "12px" }}>TOPLAM MALİYET</Text>
            <Text style={{ display: "block", fontSize: "20px", fontWeight: "700", color: "#262626", whiteSpace: "nowrap" }}>
              ₺{totalCost.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            </Text>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: stat.color, flexShrink: 0 }}></div>
                  <Text style={{ color: "#595959" }}>{stat.label}</Text>
                </div>
                <Text strong style={{ fontSize: "13px" }}>{stat.value}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ: GRAFİK ALANI */}
        <div style={{ flex: 1, minHeight: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
              barSize={24}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#8c8c8c", fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#8c8c8c", fontSize: 12 }} 
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value} 
              />
              <Tooltip 
                cursor={{ fill: "rgba(0,0,0,0.02)" }}
                formatter={(value, name) => [currencyFormatter(value), categoryLabels[name] || name]}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "15px" }} 
                formatter={(value) => categoryLabels[value] || value}
              />
              
              {categories.map((category, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === categories.length - 1;
                return (
                  <Bar 
                    key={category}
                    dataKey={category} 
                    stackId="a" 
                    fill={categoryColors[category] || "#999999"} 
                    radius={isLast ? [4, 4, 0, 0] : isFirst ? [0, 0, 4, 4] : [0, 0, 0, 0]}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Component5;
