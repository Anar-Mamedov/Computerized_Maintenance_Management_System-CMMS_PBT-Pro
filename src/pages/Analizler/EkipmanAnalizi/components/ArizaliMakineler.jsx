import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Tag, Button, Dropdown, Modal } from "antd";
import { PartitionOutlined, MoreOutlined } from "@ant-design/icons";

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
  // Modal durumlarını tutan statelerimiz kanka
  const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  // API'den gelen `Liste2` formatındaki veriyi mapliyoruz kanka
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    return listeData.map((item, index) => ({
      key: index,
      ekipman: item.Ekipman || "Belirsiz",
      tip: item.Tip || "-",
      lokasyon: item.Lokasyon || "-",
      bakimMaliyeti: item.BakimMaliyeti || "0,00",
      arizaMaliyeti: item.ArizaMaliyeti || "0,00",
      yedekParca: item.YedekParca || "0,00",
      toplam: item.Toplam || "0,00",
      ortIsEmri: item.OrtIsEmri || "0,00",
    }));
  }, [listeData]);

  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems]);

  // Görseldeki gibi para birimlerinin önüne ₺ simgesini ekleyen formatlayıcı kanka
  const formatCurrencyString = (val) => {
    if (!val) return "₺0,00";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  // Görseldeki sütun sıralamasına ve sağa/sola yaslama hizalarına birebir sadık kolonlar
  const columns = [
    {
      title: "Ekipman",
      dataIndex: "ekipman",
      key: "ekipman",
      align: "left",
      render: (text) => <Text strong style={{ color: "#111827" }}>{text}</Text>,
    },
    {
      title: "Tip",
      dataIndex: "tip",
      key: "tip",
      align: "left",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Lokasyon",
      dataIndex: "lokasyon",
      key: "lokasyon",
      align: "left",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Bakım Maliyeti",
      dataIndex: "bakimMaliyeti",
      key: "bakimMaliyeti",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
    {
      title: "Arıza Maliyeti",
      dataIndex: "arizaMaliyeti",
      key: "arizaMaliyeti",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
    {
      title: "Yedek Parça",
      dataIndex: "yedekParca",
      key: "yedekParca",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
    {
      title: "Toplam",
      dataIndex: "toplam",
      key: "toplam",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600", color: "#1f2937" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Ort. İş Emri",
      dataIndex: "ortIsEmri",
      key: "ortIsEmri",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
  ];

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
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              Ekipman Maliyet Listesi
            </Text>
          </div>
        </div>

        {/* Sağ Taraf: Badgeler ve 3 Nokta Aksiyon Menüsü */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tag color="orange" style={{ color: "#fa8c16", borderColor: "#ffd591", backgroundColor: "#fff7e6", fontWeight: "500" }}>
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
            <span>Ekipman Maliyet Listesi (Genişletilmiş Ekran)</span>
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
            <span>Maliyet ve Performans Analizi</span>
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
              Ekipmanların periyodik bakım harcamalarını, anlık arıza maliyetlerini ve parça değişim bütçelerini kıyaslamanızı sağlar.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">
              Bakım maliyeti sıfır olmasına rağmen arıza maliyeti yüksek olan ekipmanlar, koruyucu bakımlarının aksatıldığını ve reaktif ilerlendiğini işaret eder.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default IsEmriMaliyetVePerformansAnalizi;