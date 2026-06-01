import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Select, Dropdown, Button, Tag, Modal } from "antd";
import { MoreOutlined, PartitionOutlined, FullscreenOutlined, InfoCircleOutlined, FileExcelOutlined } from "@ant-design/icons";

const { Text } = Typography;

function IsEmriDagilimVePerformansListesi({ 
  listeData, 
  loading, 
  breakdownType, 
  onBreakdownTypeChange, 
  onRefresh,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onExportExcel // Üstten Excel indir fonksiyonu geçilirse diye hazır tutuldu kanka
}) {
  // Modal görünürlük state'leri kanka
  const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  // Gelen ham veriyi güvenli bir şekilde filtreleyip tabloya hazır hale getiriyoruz
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    
    return listeData.map((item, index) => ({
      key: index,
      Nedeni: item.Nedeni || "Belirtilmemiş",
      ArizaSayisi: item.ArizaSayisi || "0",
      EtkilenenEkipman: item.EtkilenenEkipman || "0",
      ToplamDurus: item.ToplamDurus || "0 saat",
      OrtSure: item.OrtSure || "0,0 saat",
      ToplamMaliyet: item.ToplamMaliyet || "0,00",
      OrtMaliyet: item.OrtMaliyet || "0,00",
      TekrarlamaOrani: item.TekrarlamaOrani || "%0",
    }));
  }, [listeData]);

  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    if (data.length < pageSize && totalItems > data.length) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems, pageSize]);

  const formatCurrencyString = (val) => {
    if (!val) return "₺0,00";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  const columns = [
    {
      title: "Arıza Nedeni",
      dataIndex: "Nedeni",
      key: "Nedeni",
      align: "left",
      render: (text) => <Text style={{ fontWeight: "600", color: "#1f1f1f" }}>{text}</Text>,
    },
    {
      title: "Arıza Sayısı",
      dataIndex: "ArizaSayisi",
      key: "ArizaSayisi",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Etkilenen Ekipman",
      dataIndex: "EtkilenenEkipman",
      key: "EtkilenenEkipman",
      align: "center",
      render: (text) => <Text style={{ fontWeight: "500" }}>{text}</Text>,
    },
    {
      title: "Toplam Duruş",
      dataIndex: "ToplamDurus",
      key: "ToplamDurus",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "6px", padding: "2px 10px", border: "none", color: "#e65c00", backgroundColor: "#ffeedd", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Ort. Süre",
      dataIndex: "OrtSure",
      key: "OrtSure",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "6px", padding: "2px 10px", border: "none", color: "#13c2c2", backgroundColor: "#e6fffb", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Toplam Maliyet",
      dataIndex: "ToplamMaliyet",
      key: "ToplamMaliyet",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "700", color: "#111827" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Ort. Maliyet",
      dataIndex: "OrtMaliyet",
      key: "OrtMaliyet",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "500", color: "#434343" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Tekrarlama Oranı",
      dataIndex: "TekrarlamaOrani",
      key: "TekrarlamaOrani",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "6px", padding: "2px 12px", border: "none", color: "#722ed1", backgroundColor: "#f9f0ff", fontWeight: "600" }}>
          {value}
        </Tag>
      ),
    },
  ];

  // Kanka menü elemanlarını isteğine göre güncelledim
  const menuItems = [
    { 
      key: "download", 
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
    },
  ];

  // Tablo şablonunu çıkardım kanka, hem ana ekranda hem modalda ortak çizilsin diye
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
              1. Arıza Nedenleri Performans Listesi
            </Text>
            <Tag color="blue" style={{ marginLeft: "5px", color: "#1890ff", borderColor: "#91d5ff", backgroundColor: "#e6f7ff" }}>
              Kırılım Bazlı
            </Tag>
          </div>
        </div>

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

      {/* 1. TAM EKRAN / BÜYÜT MODALI KANKA */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PartitionOutlined />
            <span>1. İş Emri Dağılım ve Performans Listesi (Genişletilmiş Görünüm)</span>
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

      {/* 2. BİLGİ MODALI KANKA */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Dağılım Listesi</span>
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
              Kırılım bazlı iş yükü ve maliyet analizi yapar.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">
              Yüksek adet + yüksek maliyet = kritik alan.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Ne yapmalısın?</Text>
            <Text type="secondary">
              Bu alanlara özel iyileştirme planı oluştur.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default IsEmriDagilimVePerformansListesi;