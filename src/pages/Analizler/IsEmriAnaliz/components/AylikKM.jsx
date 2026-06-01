import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Tag, Button, Dropdown, Modal } from "antd";
import { PartitionOutlined, MoreOutlined, FileExcelOutlined, FullscreenOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

function MakineArizaVeOncelikAnalizi({ 
  listeData, 
  loading,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onExportExcel
}) {
  // Kanka modal görünürlük durumları
  const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  // Gelen JSON yapısındaki (Liste3) verilerini Ant Design Table formatına güvenle map'liyoruz
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    return listeData.map((item, index) => ({
      key: index,
      Makine: item.Makine || "Belirsiz",
      SorunNedeni: item.SorunNedeni || "Belirtilmemiş",
      ArizaSayisi: item.ArizaSayisi || "0",
      ToplamMaliyet: item.ToplamMaliyet || "0,00",
      ToplamIsSuresi: item.ToplamIsSuresi || "0 saat",
      Siklik: item.Siklik || "-",
      Oncelik: item.Oncelik || "Belirsiz",
    }));
  }, [listeData]);

  // KANKA SAYFALAMA KORUMASI: Gelen totalItems'ı kontrol altında tutuyoruz
  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    if (data.length < pageSize && totalItems > data.length && page === 1) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems, pageSize, page]);

  // Para birimi formatlama helper'ı
  const formatCurrencyString = (val) => {
    if (!val) return "₺0,00";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  // Öncelik durumuna göre renk dönecek minik fonksiyon
  const getOncelikColor = (oncelik) => {
    if (String(oncelik).toLowerCase().includes("yüksek")) return "volcano";
    if (String(oncelik).toLowerCase().includes("orta")) return "warning";
    return "blue";
  };

  const columns = [
    {
      title: "Ekipman",
      dataIndex: "Makine",
      key: "Makine",
      render: (text) => <Text style={{ fontWeight: "500" }}>{text}</Text>,
    },
    {
      title: "Sorun Nedeni",
      dataIndex: "SorunNedeni",
      key: "SorunNedeni",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Arıza Sayısı",
      dataIndex: "ArizaSayisi",
      key: "ArizaSayisi",
      align: "center",
      render: (value) => (
        <Tag color="blue" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff" }}>
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
      title: "Toplam İş Süresi",
      dataIndex: "ToplamIsSuresi",
      key: "ToplamIsSuresi",
      align: "center",
      render: (value) => (
        <Tag color="geekblue" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#2f54eb", backgroundColor: "#f0f5ff" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Sıklık",
      dataIndex: "Siklik",
      key: "Siklik",
      align: "center",
      render: (value) => (
        <Tag color="purple" style={{ borderRadius: "10px", padding: "0 12px", border: "none", color: "#722ed1", backgroundColor: "#f9f0ff" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Öncelik",
      dataIndex: "Oncelik",
      key: "Oncelik",
      align: "center",
      render: (value) => (
        <Tag color={getOncelikColor(value)} style={{ borderRadius: "10px", padding: "0 12px", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
  ];

  // Kanka 3 nokta menü elemanlarını modallara bağlıyoruz
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

  // Tablo şablonu (Hem ana ekranda hem modalda kayıpsız çizilmesi için)
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
              3. Ekipman Arıza ve Müdahale Öncelik Analizi
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
            Arıza sıklığı, maliyet, iş süresi ve müdahale önceliği
          </Text>
        </div>

        {/* Sağ Taraf: Badgeler ve 3 Nokta Aksiyon Menüsü */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tag color="blue" style={{ color: "#1890ff", borderColor: "#91d5ff", backgroundColor: "#e6f7ff" }}>
            Öncelik
          </Tag>
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
            <span>3. Ekipman Arıza ve Müdahale Öncelik Analizi (Genişletilmiş Ekran)</span>
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
            <span>Arıza Analizi</span>
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
              En kritik arızaları belirler.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">
              Tekrarlayan arıza = kök neden problemi.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Ne Yapmalısın?</Text>
            <Text type="secondary">
              Kök neden analizi (RCA) yap.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MakineArizaVeOncelikAnalizi;