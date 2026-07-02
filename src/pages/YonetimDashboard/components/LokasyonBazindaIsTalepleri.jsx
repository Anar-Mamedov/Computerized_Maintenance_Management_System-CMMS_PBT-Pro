import React, { useState, useMemo, useEffect } from "react";
import { Typography, Table, Tag, Spin, message } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../api/http";

const { Text, Title } = Typography;

const LokasyonBazindaIsTalepleri = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- GLOBAL FİLTRE DİNLEYİCİSİ ---
  // Üst bardaki filtre değişimlerini window seviyesinden anlık yakalıyoruz kanka
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

  // 1. API İstek Fonksiyonu
  const fetchTopCostEquipments = async () => {
    setLoading(true);
    try {
      const payload = {
        BaslangicTarihi: globalFilters.baslangicTarihi,
        BitisTarihi: globalFilters.bitisTarihi,
        LokasyonIds: globalFilters.lokasyonIds,
      };

      const response = await AxiosInstance.post("GetTopCostEquipments", payload);

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
      console.error("GetTopCostEquipments API Hatası:", error);
      message.error("Ekipman maliyet verileri sunucu hatası.");
      setApiData({ liste: [] });
    } finally {
      setLoading(false);
    }
  };

  // Global filtrelerden herhangi biri değiştiğinde API isteği tekrarlanır
  useEffect(() => {
    fetchTopCostEquipments();
  }, [globalFilters.baslangicTarihi, globalFilters.bitisTarihi, JSON.stringify(globalFilters.lokasyonIds)]);

  // Tablo Kolon Tanımlamaları
  const columns = [
    {
      title: "Kod / Tanım",
      dataIndex: "EkipmanKodu",
      key: "EkipmanKodu",
      width: "35%",
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Text strong style={{ fontSize: "12px", color: "#1890ff" }}>{text}</Text>
          <Text ellipsis={{ tooltip: record.EkipmanTanimi }} style={{ fontSize: "13px", color: "#434343" }}>
            {record.EkipmanTanimi}
          </Text>
        </div>
      ),
    },
    {
      title: "Lokasyon / Tip",
      dataIndex: "Lokasyon",
      key: "Lokasyon",
      width: "30%",
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text ellipsis={{ tooltip: text }} style={{ fontSize: "12px", color: "#595959" }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: "11px" }}>{record.Tip}</Text>
        </div>
      ),
    },
    {
      title: "Durum",
      dataIndex: "Durum",
      key: "Durum",
      width: "15%",
      align: "center",
      render: (durum) => {
        const isDefaultActive = durum?.toLowerCase() === "çalışıyor";
        return (
          <Tag color={isDefaultActive ? "success" : "error"} style={{ marginRight: 0, borderRadius: "4px" }}>
            {durum}
          </Tag>
        );
      },
    },
    {
      title: "Maliyet",
      dataIndex: "ToplamMaliyet",
      key: "ToplamMaliyet",
      align: "right",
      width: "20%",
      render: (value, record) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Text strong style={{ color: "#fa541c", fontSize: "13px" }}>
            ₺{(value || 0).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </Text>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            ₺{(record.SaatBasinaMaliyet || 0).toFixed(2)}/sa
          </Text>
        </div>
      ),
    },
  ];

  // 2. Tablo Verisini ve Dip Toplamları Hazırlama
  const { tableData, totalCost, highestEquipment } = useMemo(() => {
    if (!apiData || !apiData.liste || !Array.isArray(apiData.liste)) {
      return { tableData: [], totalCost: 0, highestEquipment: "-" };
    }

    const formatted = apiData.liste.map((item, index) => ({
      ...item,
      key: item.EkipmanKodu ? `${item.EkipmanKodu}-${index}` : `ekipman-${index}`,
    }));

    const total = formatted.reduce((sum, item) => sum + (item.ToplamMaliyet || 0), 0);

    const sorted = [...formatted].sort((a, b) => (b.ToplamMaliyet || 0) - (a.ToplamMaliyet || 0));
    const highestName = sorted[0] ? `${sorted[0].EkipmanKodu} (${sorted[0].EkipmanTanimi})` : "-";

    return {
      tableData: formatted,
      totalCost: total,
      highestEquipment: highestName,
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
            Yüksek Maliyetli Ekipmanlar
          </Title>
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div style={{ flex: 1, position: "relative", width: "100%" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spin tip="Ekipman maliyetleri yükleniyor..." />
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
            locale={{ emptyText: "Belirtilen kriterlerde ekipman maliyet kaydı bulunamadı." }}
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
            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>Toplam Ekipman Maliyeti:</Text>
            <Text strong>
              ₺{totalCost.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            </Text>
          </div>
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", minWidth: 0 }}>
            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>En Yüksek:</Text>
            <Text strong ellipsis={{ tooltip: highestEquipment }} style={{ color: "#fa541c" }}>
              {highestEquipment}
            </Text>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", flexShrink: 0 }}>
          <Text style={{ fontSize: "12px", color: "#1890ff" }}>Ekipman / Modül Detayı</Text>
          <RightCircleOutlined style={{ color: "#1890ff", fontSize: "12px" }} />
        </div>
      </div>
    </div>
  );
};

export default LokasyonBazindaIsTalepleri;