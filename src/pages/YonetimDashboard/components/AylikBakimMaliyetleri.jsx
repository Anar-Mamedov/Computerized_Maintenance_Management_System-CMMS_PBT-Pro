import React, { useState, useMemo, useEffect } from "react";
import { Typography, Button, Spin, message } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import AxiosInstance from "../../../api/http";

const { Text, Title } = Typography;

const filterMapping = {
  "Tümü": null,
  "Yakıt": "YAKIT",
  "Bakım": "BAKIM",
  "Parça": "PARÇA",
  "Taşeron": "TAŞERON",
  "Diğer": "DİĞER",
};

const BAR_COLORS = ["#722ed1", "#ff4d4f", "#52c41a", "#1890ff", "#faad14", "#13c2c2"];

const AylikBakimMaliyetleri = () => {
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- GLOBAL FİLTRE DİNLEYİCİSİ ---
  // MainDashboard'dan gelen global filtreleri yerel state'e alıyoruz kanka
  const [globalFilters, setGlobalFilters] = useState({
    baslangicTarihi: window.globalFilters?.baslangicTarihi || "2026-01-01T00:00:00",
    bitisTarihi: window.globalFilters?.bitisTarihi || "2026-06-26T23:59:59",
    lokasyonIds: window.globalFilters?.lokasyonIds || [],
  });

  useEffect(() => {
    const handleFilterUpdate = () => {
      if (window.globalFilters) {
        setGlobalFilters({
          baslangicTarihi: window.globalFilters.baslangicTarihi,
          bitisTarihi: window.globalFilters.bitisTarihi,
          lokasyonIds: window.globalFilters.lokasyonIds,
        });
      }
    };

    window.addEventListener("globalFilterChanged", handleFilterUpdate);
    return () => window.removeEventListener("globalFilterChanged", handleFilterUpdate);
  }, []);

  const filterOptions = ["Tümü", "Yakıt", "Bakım", "Parça", "Taşeron", "Diğer"];

  // 1. API İstek Fonksiyonu
  const fetchLocationCosts = async () => {
    setLoading(true);
    try {
      const payload = {
        BaslangicTarihi: globalFilters.baslangicTarihi,
        BitisTarihi: globalFilters.bitisTarihi,
        LokasyonIds: globalFilters.lokasyonIds,
        GiderTipi: filterMapping[activeFilter],
      };

      const response = await AxiosInstance.post("GetLocationCosts", payload);

      let rawData = null;
      if (response?.liste) rawData = response;
      else if (response?.data?.liste) rawData = response.data;
      else if (response?.data?.data?.liste) rawData = response.data.data;

      if (rawData) {
        setApiData(rawData);
      } else {
        setApiData({ liste: [] });
      }
    } catch (error) {
      console.error("GetLocationCosts API Hatası:", error);
      message.error("Lokasyon maliyetleri sunucu hatası.");
      setApiData({ liste: [] });
    } finally {
      setLoading(false);
    }
  };

  // Hem kendi buton filtreleri (activeFilter) hem de üstteki global filtreler değiştiğinde tetikleniyor
  useEffect(() => {
    fetchLocationCosts();
  }, [globalFilters.baslangicTarihi, globalFilters.bitisTarihi, JSON.stringify(globalFilters.lokasyonIds), activeFilter]);

  // 2. Recharts Grafik Verisi Hazırlama ve Filtreleme
  const chartData = useMemo(() => {
    if (!apiData || !apiData.liste || !Array.isArray(apiData.liste)) return [];

    return apiData.liste
      .filter((item) =>
        item?.LokasyonAdi?.toLowerCase().includes(searchText.toLowerCase())
      )
      .map((item) => ({
        name: item.LokasyonAdi,
        value: item.ToplamTutar || 0,
      }));
  }, [apiData, searchText]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "380px",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        border: "1px solid #f0f0f0",
        boxSizing: "border-box",
      }}
    >
      {/* --- HEADER --- */}
      <div style={{ flexShrink: 0, marginBottom: "8px" }}>
        <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontSize: "18px", fontWeight: "600" }}>
          Lokasyon Bazlı Maliyet
        </Title>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginTop: "4px" }}>
          Maliyet lokasyon, makine türü (yakıt, bakım, parça, taşeron) ile dağılım
        </Text>
      </div>

      {/* --- TOOLBAR --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", marginBottom: "4px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {filterOptions.map((option) => (
            <Button
              key={option}
              type={activeFilter === option ? "primary" : "default"}
              size="middle"
              shape="round"
              onClick={() => setActiveFilter(option)}
              style={{
                fontSize: "13px",
                flexShrink: 0,
                fontWeight: activeFilter === option ? "600" : "400",
                padding: "0 16px",
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* --- GRAFİK ALANI --- */}
      <div style={{ flex: 1, minHeight: 0, width: "100%", position: "relative" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin tip="Veriler güncelleniyor..." />
          </div>
        ) : chartData.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Text type="secondary">Maliyet verisi bulunamadı.</Text>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 25, right: 20, left: 20, bottom: 25 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#595959", fontSize: 12 }}
                dy={10}
              />
              <YAxis hide domain={[0, "dataMax + 5000"]} />
              
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.01)" }}
                formatter={(value) => [`₺${value.toLocaleString("tr-TR")}`, "Maliyet"]}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
              
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top"
                  offset={8}
                  formatter={(value) => `₺${value.toLocaleString("tr-TR")}`}
                  style={{ fontSize: "11px", fontWeight: "700", fill: "#1f1f1f" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AylikBakimMaliyetleri;