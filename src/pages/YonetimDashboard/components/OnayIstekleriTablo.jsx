import React, { useMemo, useState, useEffect } from "react";
import { Typography, Spin, message } from "antd";
import { ShopOutlined, WarningOutlined } from "@ant-design/icons";
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
  const fetchTopSuppliers = async () => {
    setLoading(true);
    try {
      const payload = {
        BaslangicTarihi: baslangicTarihi,
        BitisTarihi: bitisTarihi,
        LokasyonIds: lokasyonIds,
      };

      const response = await AxiosInstance.post("GetTopSuppliers", payload);

      // API dokümanına göre liste root altındaki "data" array'inde geliyor
      if (response?.status_code === 200 || response?.status === 200) {
        const resData = response.data ? response.data : response;
        setApiData(resData);
      } else {
        message.error("Tedarikçi verileri alınırken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Tedarikçi API Hatası:", error);
      message.error("Tedarikçi verileri sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  // Filtreler değiştikçe tetikle
  useEffect(() => {
    fetchTopSuppliers();
  }, [baslangicTarihi, bitisTarihi, JSON.stringify(lokasyonIds)]);

  // 2. Verileri İşleme ve Yoğunlaşma Riski Hesaplama
  const { suppliersList, riskPercentage } = useMemo(() => {
    if (!apiData || !apiData.data || apiData.data.length === 0) {
      return { suppliersList: [], riskPercentage: 0 };
    }

    // Gelen veriyi en yüksek tutardan aşağıya doğru sıralayalım
    const sortedData = [...apiData.data].sort((a, b) => (b.ToplamTutar || 0) - (a.ToplamTutar || 0));

    // Genel toplamı ve ilk 2 firmanın toplamını bulalım
    const generalTotal = sortedData.reduce((sum, item) => sum + (item.ToplamTutar || 0), 0);
    const topTwoTotal = sortedData.slice(0, 2).reduce((sum, item) => sum + (item.ToplamTutar || 0), 0);

    const calculatedRisk = generalTotal > 0 ? ((topTwoTotal / generalTotal) * 100).toFixed(0) : 0;

    const formattedList = sortedData.map((item, index) => ({
      key: index + 1,
      name: item.FirmaAdi || "Bilinmeyen Tedarikçi",
      amount: `₺${(item.ToplamTutar || 0).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    }));

    return {
      suppliersList: formattedList,
      riskPercentage: calculatedRisk,
    };
  }, [apiData]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", minHeight: "350px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Spin tip="Tedarikçi verileri yükleniyor..." />
      </div>
    );
  }

  if (suppliersList.length === 0) {
    return (
      <div style={{ padding: "20px", height: "100%", minHeight: "350px", backgroundColor: "white", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Text type="secondary">Belirtilen tarihler arasında tedarikçi verisi bulunamadı.</Text>
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
            En Büyük Tedarikçiler
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "13px", display: "block", marginTop: "5px" }}>
          Harcama yoğunlaşması ve ana tedarikçi dağılımı
        </Text>
      </div>

      {/* --- CONTENT LIST --- */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0px" }}>
        
        {/* Liste Başlıkları */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px 8px 10px", borderBottom: "1px solid #f0f0f0", marginBottom: "8px" }}>
          <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600" }}>TEDARİKÇİ</Text>
          <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600", paddingRight: "10px" }}>TUTAR</Text>
        </div>

        {suppliersList.map((item) => (
          <div
            key={item.key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              borderRadius: "8px",
              transition: "background-color 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {/* Sıra No ve Firma İsmi */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold", color: "#8c8c8c", flexShrink: 0 }}>
                {item.key}
              </div>
              <Text strong ellipsis style={{ color: "#434343", fontSize: "13px" }}>
                {item.name}
              </Text>
            </div>

            {/* Tutar */}
            <div style={{ display: "flex", alignItems: "center", paddingRight: "10px" }}>
              <Text strong style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                {item.amount}
              </Text>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER / RISK ANALYSIS --- */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <WarningOutlined style={{ color: "#faad14" }} />
          <Text style={{ fontSize: "12px", color: "#595959", fontWeight: "500" }}>
            Yoğunlaşma riski:
          </Text>
        </div>
        <Text type="secondary" style={{ fontSize: "11px", marginLeft: "20px" }}>
          İlk 2 tedarikçi toplam harcamanın <strong style={{ color: "#434343" }}>~%{riskPercentage}</strong>’ini oluşturuyor.
        </Text>
        
        <div style={{ marginTop: "5px", textAlign: "right" }}>
          <a href="#" style={{ fontSize: "12px", color: "#1890ff" }}>Satınalma Detayı &rarr;</a>
        </div>
      </div>
    </div>
  );
};

export default LokasyonBazindaIsTalepleri;