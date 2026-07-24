import React, { useMemo, useState, useEffect } from "react";
import { Typography, Progress, Tooltip, Spin, message } from "antd";
import { RightCircleOutlined, PieChartOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../api/http";
import useDashboardFilters from "./useDashboardFilters";

const { Text, Title } = Typography;

// Renk haritası (API'den gelen GiderTipi isimlerine göre)
const categoryColors = {
  YAKIT: "#ff4d4f",   // Kırmızı ton
  BAKIM: "#1890ff",   // Mavi ton
  PARÇA: "#faad14",   // Turuncu/Altın ton
  TAŞERON: "#13c2c2", // Turkuaz ton
  DİĞER: "#722ed1",   // Mor ton
};

// Arayüzde düzgün etiket göstermek için
const categoryLabels = {
  YAKIT: "Yakıt",
  BAKIM: "Bakım",
  PARÇA: "Parça",
  TAŞERON: "Taşeron",
  DİĞER: "Diğer",
};

const PersonelKPITablosu = () => {
  const { baslangicTarihi, bitisTarihi, lokasyonIds, giderTipi } = useDashboardFilters();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. API İstek Fonksiyonu
  const fetchCostDistribution = async () => {
    setLoading(true);
    try {
      const payload = {
        BaslangicTarihi: baslangicTarihi,
        BitisTarihi: bitisTarihi,
        LokasyonIds: lokasyonIds,
        GiderTipi: giderTipi,
      };

      const response = await AxiosInstance.post("GetCostDistribution", payload);

      const resData = response?.liste
        ? response
        : response?.data?.liste
          ? response.data
          : null;

      if (resData) {
        setApiData(resData);
      } else {
        setApiData({ liste: [] });
        message.error("Maliyet dağılımı verileri alınırken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Maliyet Dağılımı API Hatası:", error);
      message.error("Maliyet dağılımı sunucu hatası.");
      setApiData({ liste: [] });
    } finally {
      setLoading(false);
    }
  };

  // Filtreler değiştikçe tetikle
  useEffect(() => {
    fetchCostDistribution();
  }, [baslangicTarihi, bitisTarihi, JSON.stringify(lokasyonIds), giderTipi]);

  // 2. Verileri İşleme ve Yüzde Hesaplama Bölümü
  const costDistributionData = useMemo(() => {
    if (!apiData || !apiData.liste || apiData.liste.length === 0) return [];

    // Önce genel toplamı bulalım ki yüzdeleri hesaplayabilelim
    const total = apiData.liste.reduce((sum, item) => sum + (item.ToplamTutar || 0), 0);

    if (total === 0) return [];

    return apiData.liste.map((item) => {
      const gTip = item.GiderTipi.toUpperCase();
      const pct = ((item.ToplamTutar / total) * 100).toFixed(1); // Virgülden sonra tek hane (%45.8 gibi)

      return {
        name: categoryLabels[gTip] || item.GiderTipi,
        amount: `₺${item.ToplamTutar.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        percentage: parseFloat(pct),
        color: categoryColors[gTip] || "#8c8c8c",
      };
    }).sort((a, b) => b.percentage - a.percentage); // En yüksek paya sahip olanı en üste getirir
  }, [apiData]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", minHeight: "300px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Spin tip="Dağılım verileri yükleniyor..." />
      </div>
    );
  }

  if (costDistributionData.length === 0) {
    return (
      <div style={{ padding: "20px", height: "100%", minHeight: "300px", backgroundColor: "white", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Text type="secondary">Belirtilen kriterlerde maliyet dağılımı bulunamadı.</Text>
      </div>
    );
  }

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
        gap: "15px",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* --- HEADER --- */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontSize: "18px" }}>
            Maliyet Dağılımı (Dönem İçi)
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
          Ana maliyet kalemlerinin toplam içindeki ayı ve hızlı karşılaştırma
        </Text>
      </div>

      {/* --- CONTENT LIST --- */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px", paddingRight: "5px" }}>
        {costDistributionData.map((item, index) => (
          <div key={index}>
            {/* Üst Satır: İsim ve Tutar */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <Text strong style={{ color: "#434343", fontSize: "14px" }}>
                {item.name}
              </Text>
              <Text strong style={{ fontSize: "14px" }}>
                {item.amount}
              </Text>
            </div>

            {/* Orta: Progress Bar */}
            <Tooltip title={`Toplam içindeki payı: %${item.percentage}`}>
              <Progress
                percent={item.percentage}
                strokeColor={item.color}
                showInfo={false}
                size="small"
                trailColor="#f5f5f5"
                style={{ marginBottom: "2px" }}
              />
            </Tooltip>

            {/* Alt Satır: Yüzdelik Pay */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Pay: <span style={{ color: item.color, fontWeight: "600" }}>%{item.percentage}</span>
              </Text>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER / TIP --- */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <RightCircleOutlined style={{ color: "#8c8c8c", marginTop: "2px" }} />
        <Text type="secondary" style={{ fontSize: "11px", lineHeight: "1.4" }}>
          İpucu: Kalem payları, yöneticiye “hangi maliyet türü baskın?” sorusuna tek bakışta cevap verir.
        </Text>
      </div>
    </div>
  );
};

export default PersonelKPITablosu;
