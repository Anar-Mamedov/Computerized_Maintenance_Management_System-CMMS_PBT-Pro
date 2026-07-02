import React, { useState, useMemo, useEffect } from "react";
import { Typography, Table, Spin, message } from "antd";
import { DashboardOutlined, RightCircleOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../api/http";

const { Text, Title } = Typography;

const LokasyonBazindaIsTalepleri = ({
  baslangicTarihi = "2026-01-01T00:00:00",
  bitisTarihi = "2026-06-26T23:59:59",
  lokasyonIds = [],
}) => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. API İstek Fonksiyonu
  const fetchLocationPerformance = async () => {
    setLoading(true);
    try {
      const payload = {
        BaslangicTarihi: baslangicTarihi,
        BitisTarihi: bitisTarihi,
        LokasyonIds: lokasyonIds,
      };

      const response = await AxiosInstance.post("GetLocationPerformanceTable", payload);

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
      console.error("GetLocationPerformanceTable API Hatası:", error);
      message.error("Lokasyon performans verileri sunucu hatası.");
      setApiData({ liste: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationPerformance();
  }, [baslangicTarihi, bitisTarihi, JSON.stringify(lokasyonIds)]);

  // Tablo Kolon Tanımlamaları - Performans odaklı yeni verilere göre esnek ayarlandı
  const columns = [
    {
      title: "Lokasyon Adı",
      dataIndex: "LokasyonAdi",
      key: "LokasyonAdi",
      width: "35%",
      render: (text) => (
        <Text strong ellipsis={{ tooltip: text }} style={{ fontSize: "13px", color: "#434343" }}>
          {text || "Bilinmeyen Lokasyon"}
        </Text>
      ),
    },
    {
      title: "Varlık / Kapasite",
      key: "varlikKapasite",
      width: "25%",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <Text style={{ fontSize: "12px", color: "#595959" }}>
            <span style={{ fontWeight: "600" }}>{record.EkipmanSayisi || 0}</span> Ekipman
          </Text>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            {record.PersonelSayisi || 0} Personel / {(record.CalismaSaati || 0).toLocaleString("tr-TR")} sa
          </Text>
        </div>
      ),
    },
    {
      title: "Maliyet Kırılımı (Toplam / Yakıt / Satınalma)",
      dataIndex: "ToplamMaliyet",
      key: "ToplamMaliyet",
      align: "right",
      width: "40%",
      render: (value, record) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Text strong style={{ color: "#1890ff", fontSize: "13px" }}>
            ₺{(value || 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
          </Text>
          <div style={{ display: "flex", gap: "6px", fontSize: "11px", color: "#8c8c8c", marginTop: "1px" }}>
            <span>Ykt: ₺{(record.YakitMaliyeti || 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</span>
            <span>•</span>
            <span>Stn: ₺{(record.SatinalmaMaliyeti || 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      ),
    },
  ];

  // 2. Tablo Verisini ve Alt Toplam İstatistiklerini Hazırlama
  const { tableData, totalCost, maxCostLocation } = useMemo(() => {
    if (!apiData || !apiData.liste || !Array.isArray(apiData.liste)) {
      return { tableData: [], totalCost: 0, maxCostLocation: "-" };
    }

    const formatted = apiData.liste.map((item, index) => ({
      ...item,
      key: item.LokasyonAdi ? `${item.LokasyonAdi}-${index}` : `lokasyon-${index}`,
    }));

    // Tüm lokasyonların toplam maliyetini hesapla
    const total = formatted.reduce((sum, item) => sum + (item.ToplamMaliyet || 0), 0);

    // En maliyetli lokasyonu bul
    const sorted = [...formatted].sort((a, b) => (b.ToplamMaliyet || 0) - (a.ToplamMaliyet || 0));
    const highestLocationName = sorted[0]?.LokasyonAdi || "-";

    return {
      tableData: formatted,
      totalCost: total,
      maxCostLocation: highestLocationName,
    };
  }, [apiData]);

  return (
    <div
      style={{
        width: "100%",
        height: "430px",
        minHeight: "100%",
        maxHeight: "calc(100vh - 40px)",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        gap: "15px",
        border: "1px solid #f0f0f0",
        boxSizing: "border-box",
      }}
    >
      {/* --- HEADER --- */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontSize: "18px" }}>
            Lokasyon Performans Özeti
          </Title>
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div style={{ flex: 1, position: "relative", width: "100%" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin tip="Performans verileri yükleniyor..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            size="middle"
            rowKey="key"
            scroll={{ y: 220 }}
            style={{ height: "100%" }}
            locale={{ emptyText: "Belirtilen kriterlerde lokasyon performans kaydı bulunamadı." }}
          />
        )}
      </div>

      {/* --- FOOTER / STATS --- */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0, flex: 1, paddingRight: "15px" }}>
          <div style={{ display: "flex", gap: "8px", fontSize: "12px" }}>
            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>Genel Toplam Maliyet:</Text>
            <Text strong>
              ₺{totalCost.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            </Text>
          </div>
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", minWidth: 0 }}>
            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>En Yüksek Harcama:</Text>
            <Text strong ellipsis={{ tooltip: maxCostLocation }} style={{ color: "#1890ff" }}>
              {maxCostLocation}
            </Text>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", flexShrink: 0 }}>
          <Text style={{ fontSize: "12px", color: "#1890ff" }}>Performans Raporu</Text>
          <RightCircleOutlined style={{ color: "#1890ff", fontSize: "12px" }} />
        </div>
      </div>
    </div>
  );
};

export default LokasyonBazindaIsTalepleri;