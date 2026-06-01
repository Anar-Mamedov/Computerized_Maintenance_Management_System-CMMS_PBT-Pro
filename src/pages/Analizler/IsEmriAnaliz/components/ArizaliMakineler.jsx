import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Tag, Button, Dropdown, Modal } from "antd";
import { PartitionOutlined, MoreOutlined, FileExcelOutlined, FullscreenOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

function IsEmriMaliyetVePerformansAnalizi({ 
  listeData, 
  loading,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onExportExcel
}) {
  // Kanka modal durumlarını tutan statelerimiz
  const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    return listeData.map((item, index) => ({
      key: index,
      TipAdi: item.TipAdi || "Belirsiz",
      Adet: item.Adet || "0",
      Malzeme: item.Malzeme || "0,00",
      Iscilik: item.Iscilik || "0,00",
      DisServis: item.DisServis || "0,00",
      Toplam: item.Toplam || "0,00",
      OrtMaliyet: item.OrtMaliyet || "0,00",
      OrtSure: item.OrtSure || "0,0 gün",
    }));
  }, [listeData]);

  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    if (data.length < pageSize && totalItems > data.length && page === 1) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems, pageSize, page]);

  const formatCurrencyString = (val) => {
    if (!val) return "₺0,00";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  const columns = [
    {
      title: "İş Emri Tipleri",
      dataIndex: "TipAdi",
      key: "TipAdi",
      render: (text) => <Text style={{ fontWeight: "500" }}>{text}</Text>,
    },
    {
      title: "İş Emri (Adet)",
      dataIndex: "Adet",
      key: "Adet",
      align: "center",
      render: (value) => (
        <Tag color="blue" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Malzeme Maliyeti",
      dataIndex: "Malzeme",
      key: "Malzeme",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
    {
      title: "İşçilik Maliyeti",
      dataIndex: "Iscilik",
      key: "Iscilik",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
    {
      title: "Dış Servis Maliyeti",
      dataIndex: "DisServis",
      key: "DisServis",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
    {
      title: "Toplam Maliyet",
      dataIndex: "Toplam",
      key: "Toplam",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Ort. Maliyet",
      dataIndex: "OrtMaliyet",
      key: "OrtMaliyet",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
    {
      title: "Ort. Tamamlanma",
      dataIndex: "OrtSure",
      key: "OrtSure",
      align: "center",
      render: (value) => (
        <Tag color="cyan" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#13c2c2", backgroundColor: "#e6fffb" }}>
          {value}
        </Tag>
      ),
    },
  ];

  // Kanka 3 nokta menü elemanları tetikleyicileri modallara bağlandı
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

  // Tablo içeriğini sarmalladık ki hem normal ekranda hem modalda ortak çağrılsın kanka
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
    <div style={{ width: "100%", borderRadius: "10px", backgroundColor: "white", display: "flex", flexDirection: "column", padding: "20px 15px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      {/* Üst Başlık ve Seçenekler Alanı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PartitionOutlined style={{ fontSize: "18px", color: "#333" }} />
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              2. İş Emirleri Maliyet ve Performans Analizi
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
            Malzeme, işçilik, dış servis ve toplam maliyet performansı
          </Text>
        </div>

        {/* Sağ Taraf: Badgeler ve 3 Nokta Aksiyon Menüsü */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tag color="blue" style={{ color: "#1890ff", borderColor: "#91d5ff", backgroundColor: "#e6f7ff" }}>
            Maliyet
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
            <span>2. İş Emirleri Maliyet ve Performans Analizi (Genişletilmiş Ekran)</span>
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
            <span>Maliyet Analizi</span>
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
              Maliyet bileşenlerini detaylı analiz eder.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">
              İşçilik mi malzeme mi maliyeti artırıyor?
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Ne Yapmalısın?</Text>
            <Text type="secondary">
              Yüksek maliyet kalemini optimize et.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default IsEmriMaliyetVePerformansAnalizi;