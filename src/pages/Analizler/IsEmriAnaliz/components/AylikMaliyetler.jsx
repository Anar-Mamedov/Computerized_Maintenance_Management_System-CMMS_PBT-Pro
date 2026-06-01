import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Dropdown, Button, Tag, Modal } from "antd";
import { MoreOutlined, PartitionOutlined, FullscreenOutlined, InfoCircleOutlined, FileExcelOutlined } from "@ant-design/icons";

const { Text } = Typography;

function AtolyePerformansKarsilastirmasi({ 
  listeData, 
  loading, 
  breakdownType, 
  onRefresh,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onExportExcel
}) {
  // Kanka modal görünürlük durumları
  const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  // Gelen ham veriyi (Liste4 yapısına göre) güvenli bir şekilde map'liyoruz
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    
    return listeData.map((item, index) => ({
      key: index,
      GrupAdi: item.GrupAdi || "Belirsiz",
      ToplamIs: item.ToplamIs || "0",
      AcikIs: item.AcikIs || "0",
      GecikmeOrani: item.GecikmeOrani || "%0",
      Zamaninda: item.Zamaninda || "%100",
      ToplamCalisma: item.ToplamCalisma || "0 saat",
      DurusSuresi: item.DurusSuresi || "0 saat",
      OrtTamamlama: item.OrtTamamlama || "0,0 gün",
      ToplamMaliyet: item.ToplamMaliyet || "0,00",
      YenidenIslem: item.YenidenIslem || "0",
    }));
  }, [listeData]);

  // KANKA SAYFALAMA KORUMASI: API'den Liste4TotalCount (11) geleceği için 2 sayfa oluşturacak
  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    if (data.length < pageSize && totalItems > data.length && page === 1) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems, pageSize, page]);

  // API'den gelen formatlı string para biriminin başına ₺ ekleyen fonksiyon
  const formatCurrencyString = (val) => {
    if (!val || val === "0,00" || val === "0") return "₺0";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  const columns = [
    {
      title: "Grup Adı",
      dataIndex: "GrupAdi",
      key: "GrupAdi",
      render: (text) => <Text style={{ fontWeight: "500" }}>{text}</Text>,
    },
    {
      title: "Toplam İş",
      dataIndex: "ToplamIs",
      key: "ToplamIs",
      align: "center",
      render: (value) => (
        <Tag color="blue" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Açık İş",
      dataIndex: "AcikIs",
      key: "AcikIs",
      align: "center",
      render: (value) => (
        <Tag color="warning" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#fa8c16", backgroundColor: "#fff7e6" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Gecikme Oranı",
      dataIndex: "GecikmeOrani",
      key: "GecikmeOrani",
      align: "center",
      render: (value) => (
        <Tag color="error" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#f5222d", backgroundColor: "#fff1f0", fontWeight: "600" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Zamanında",
      dataIndex: "Zamaninda",
      key: "Zamaninda",
      align: "center",
      render: (value) => (
        <Tag color="success" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#52c41a", backgroundColor: "#f6ffed", fontWeight: "600" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Toplam Çalışma",
      dataIndex: "ToplamCalisma",
      key: "ToplamCalisma",
      align: "center",
      render: (value) => (
        <Tag color="geekblue" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#2f54eb", backgroundColor: "#f0f5ff" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Duruş Süresi",
      dataIndex: "DurusSuresi",
      key: "DurusSuresi",
      align: "center",
      render: (value) => (
        <Tag color="volcano" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#fa541c", backgroundColor: "#fff2e8" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Ort. Tamamlama",
      dataIndex: "OrtTamamlama",
      key: "OrtTamamlama",
      align: "center",
      render: (value) => (
        <Tag color="cyan" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#13c2c2", backgroundColor: "#e6fffb" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Toplam Maliyet",
      dataIndex: "ToplamMaliyet",
      key: "ToplamMaliyet",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Yeniden İşlem",
      dataIndex: "YenidenIslem",
      key: "YenidenIslem",
      align: "center",
      render: (value) => (
        <Tag color="purple" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#722ed1", backgroundColor: "#f9f0ff" }}>
          {value}
        </Tag>
      ),
    },
  ];

  // 3 Nokta Aksiyon Menüsü Elemanları
  const menuItems = [
    {
      key: "excel",
      label: "Excel İndir",
      onClick: () => { if (onExportExcel) onExportExcel(); else console.log("Excel indiriliyor..."); }
    },
    {
      key: "fullscreen",
      label: "Tam Ekran Aç",
      onClick: () => setIsFullscreenModalVisible(true)
    },
    {
      key: "info",
      label: "Bilgi",
      onClick: () => setIsInfoModalVisible(true)
    }
  ];

  // Ortak tablo yapısı sarmalı
  const renderTableContent = () => (
    <Table
      columns={columns}
      dataSource={data}
      size="middle"
      bordered={false}
      pagination={{
        current: page,
        pageSize: pageSize,
        total: calculatedTotal, 
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        position: ["bottomRight"],
        size: "small",
        onChange: (currentPage, currentPageSize) => {
          if (onPageChange) {
            onPageChange(currentPage, currentPageSize);
          }
        }
      }}
    />
  );

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "10px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px 15px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Üst Başlık ve Seçenekler Alanı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PartitionOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              4. Atölye Performans Karşılaştırması
            </Text>
            <Tag color="purple" style={{ marginLeft: "5px", color: "#722ed1", borderColor: "#d3adf7", backgroundColor: "#f9f0ff" }}>
              Performans
            </Tag>
          </div>
          <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
            Atölyelerin iş yükü, gecikme, süre, maliyet ve verimlilik karşılaştırması
          </Text>
        </div>

        {/* Sağ Taraf: Aksiyon Butonu */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined style={{ fontSize: "18px" }} />} />
          </Dropdown>
        </div>
      </div>

      {/* Tablo Alanı */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Spin spinning={loading}>
          {renderTableContent()}
        </Spin>
      </div>

      {/* 1. TAM EKRAN MODALI */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PartitionOutlined />
            <span>4. Atölye Performans Karşılaştırması (Genişletilmiş Görünüm)</span>
          </div>
        }
        open={isFullscreenModalVisible}
        onCancel={() => setIsFullscreenModalVisible(false)}
        footer={null}
        width="95%"
        centered
        destroyOnClose
      >
        <div style={{ paddingTop: "15px" }}>
          <Spin spinning={loading}>
            {renderTableContent()}
          </Spin>
        </div>
      </Modal>

      {/* 2. BİLGİ MODALI */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Performans Analizi</span>
          </div>
        }
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsInfoModalVisible(false)}>
            Anladım
          </Button>
        ]}
        centered
      >
        <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Ne işe yarar?</Text>
            <Text type="secondary">
              Atölye ve ekip performansını karşılaştırır.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">
              Yüksek gecikme + düşük verimlilik = problem.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Ne Yapmalısın?</Text>
            <Text type="secondary">
              Süreç ve kaynak optimizasyonu yap.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AtolyePerformansKarsilastirmasi;