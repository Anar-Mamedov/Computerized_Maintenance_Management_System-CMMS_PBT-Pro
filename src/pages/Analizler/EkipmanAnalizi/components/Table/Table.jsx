import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Dropdown, Button, Tag, Modal } from "antd";
import { MoreOutlined, PartitionOutlined } from "@ant-design/icons";

const { Text } = Typography;

function EkipmanPerformansListesi({ 
  listeData, 
  loading, 
  page,
  pageSize,
  totalItems,
  onPageChange,
  onExportExcel
}) {
  const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  // API'den gelen `listeData` dizisini Ant Design tablosuna tam uyumlu mapliyoruz kanka
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    
    return listeData.map((item, index) => ({
      key: index,
      ekipmanKodu: item.EkipmanKodu || "-",
      ekipmanTanimi: item.EkipmanTanimi || "-",
      ekipmanTipi: item.EkipmanTipi || "-",
      lokasyon: item.Lokasyon || "-",
      yas: item.Yas || "0 yıl",
      isEmri: item.IsEmri || "0",
      ariza: item.Ariza || "0",
      durus: item.Durus || "0 saat",
      toplamMaliyet: item.ToplamMaliyet || "0,00",
      kullanim: item.Kullanim || "%0",
      risk: item.Risk || "Düşük",
    }));
  }, [listeData]);

  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems]);

  // Maliyet değerlerinin başına Türk Lirası simgesini görseldeki gibi şık eklemek için kanka
  const formatCurrencyString = (val) => {
    if (!val) return "₺0,00";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  // Görseldeki sütunların sırasına ve hizalamalarına birebir sadık kalınan kolon tanımlamaları
  const columns = [
    {
      title: "Ekipman Kodu",
      dataIndex: "ekipmanKodu",
      key: "ekipmanKodu",
      align: "left",
      render: (text) => <Text strong style={{ color: "#111827" }}>{text}</Text>
    },
    {
      title: "Ekipman Tanımı",
      dataIndex: "ekipmanTanimi",
      key: "ekipmanTanimi",
      align: "left",
    },
    {
      title: "Ekipman Tipi",
      dataIndex: "ekipmanTipi",
      key: "ekipmanTipi",
      align: "left",
      render: (text) => <Text type="secondary">{text}</Text>
    },
    {
      title: "Lokasyon",
      dataIndex: "lokasyon",
      key: "lokasyon",
      align: "left",
      render: (text) => <Text type="secondary">{text}</Text>
    },
    {
      title: "Yaş",
      dataIndex: "yas",
      key: "yas",
      align: "center",
    },
    {
      title: "İş Emri",
      dataIndex: "isEmri",
      key: "isEmri",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "12px", padding: "2px 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Arıza",
      dataIndex: "ariza",
      key: "ariza",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "12px", padding: "2px 10px", border: "none", color: "#ff4d4f", backgroundColor: "#fff1f0", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Duruş",
      dataIndex: "durus",
      key: "durus",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "12px", padding: "2px 10px", border: "none", color: "#fa8c16", backgroundColor: "#fff7e6", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Toplam Maliyet",
      dataIndex: "toplamMaliyet",
      key: "toplamMaliyet",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600", color: "#1f2937" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Kullanım",
      dataIndex: "kullanim",
      key: "kullanim",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "4px", padding: "1px 6px", border: "none", color: "#52c41a", backgroundColor: "#f6ffed", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Risk",
      dataIndex: "risk",
      key: "risk",
      align: "center",
      render: (riskText) => {
        // Görseldeki dinamik risk seviyelerine göre renk kırılımı kanka
        let colorConfig = { color: "#52c41a", bg: "#f6ffed" }; // Düşük -> Yeşil
        if (riskText === "Yüksek" || riskText === "Critical") {
          colorConfig = { color: "#ff4d4f", bg: "#fff1f0" }; // Yüksek -> Kırmızı
        } else if (riskText === "Orta" || riskText === "Medium") {
          colorConfig = { color: "#fa8c16", bg: "#fff7e6" }; // Orta -> Turuncu
        }
        return (
          <Tag style={{ borderRadius: "12px", padding: "2px 12px", border: "none", color: colorConfig.color, backgroundColor: colorConfig.bg, fontWeight: "600" }}>
            {riskText}
          </Tag>
        );
      },
    },
  ];

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

  const renderTableContent = () => (
    <Table
      columns={columns}
      dataSource={data}
      size="middle"
      bordered={false}
      rowClassName={() => "custom-table-row"}
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
      {/* Üst Başlık Alanı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              Ekipman Performans Listesi
            </Text>
            <Tag color="blue" style={{ marginLeft: "5px", color: "#1890ff", borderColor: "#91d5ff", backgroundColor: "#e6f7ff", fontWeight: "500" }}>
              Kritik Varlıklar
            </Tag>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined style={{ fontSize: "18px" }} />} />
          </Dropdown>
        </div>
      </div>

      {/* Tablo Render Alanı */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Spin spinning={loading}>
          {renderTableContent()}
        </Spin>
      </div>

      {/* Tam Ekran Geniş Görünüm Modalı */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PartitionOutlined />
            <span>Ekipman Performans Listesi (Genişletilmiş Görünüm)</span>
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

      {/* Bilgi Modalı */}
      <Modal
        title="Ekipman Performans Listesi"
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
              İşletmedeki makinelerin yaşını, açılan toplam iş emrini, arıza sayılarını, duruş sürelerini ve oluşturdukları maliyet riskini tek bir matriste listeler.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">
              "Yüksek" risk etiketine sahip, duruş süresi uzun ve kullanım oranı düşük makineler, operasyonda darboğaz yaratan öncelikli ekipmanlardır.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EkipmanPerformansListesi;