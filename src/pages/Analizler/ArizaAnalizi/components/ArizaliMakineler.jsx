import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Select, Dropdown, Button, Tag, Modal } from "antd";
import { MoreOutlined, PartitionOutlined } from "@ant-design/icons";

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
  onExportExcel
}) {
  const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  // Gelen ham veriyi resimdeki ve JSON'daki alanlara göre tam uyumlu eşliyoruz kanka
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    
    return listeData.map((item, index) => ({
      key: index,
      KrilimAdi: item.GrupAdi || "Belirsiz",
      ArizaSayisi: item.ArizaSayisi || "0",
      AcikAriza: item.AcikAriza || "0",
      DurusSuresi: item.DurusSuresi ? (String(item.DurusSuresi).includes("saat") ? item.DurusSuresi : `${item.DurusSuresi} saat`) : "0 saat",
      OrtSure: item.OrtSure ? (String(item.OrtSure).includes("saat") ? item.OrtSure : `${item.OrtSure} saat`) : "0 saat",
      ToplamMaliyet: item.ToplamMaliyet || "0,00",
      SonAriza: item.SonAriza || "- -" // Resimdeki en sağdaki tarih alanı kanka
    }));
  }, [listeData]);

  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems]);

  const formatCurrencyString = (val) => {
    if (!val) return "₺0";
    if (String(val).includes("₺")) return val;
    // Gelen veri 58.600 formatında değilse bile başına para birimi koyuyoruz
    return `₺${val}`;
  };
  
  const getBreakdownLabel = () => {
    if (breakdownType === 1 || breakdownType === "Tip") return "Ekipman";
    if (breakdownType === 2) return "Lokasyon";
    if (breakdownType === 3) return "Atölye";
    if (breakdownType === 4) return "Ekipman Tipi";
    return "Ekipman";
  };

  // Kolonları tamamen resimdeki sıraya ve tasarıma göre dizdik kanka
  const columns = [
    {
      title: getBreakdownLabel(),
      dataIndex: "KrilimAdi",
      key: "KrilimAdi",
      render: (text) => <Text style={{ fontWeight: "500", color: "#1f2937" }}>{text}</Text>,
    },
    {
      title: "Arıza Sayısı",
      dataIndex: "ArizaSayisi",
      key: "ArizaSayisi",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "12px", padding: "0 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Açık Arıza",
      dataIndex: "AcikAriza",
      key: "AcikAriza",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "12px", padding: "0 10px", border: "none", color: "#d4b106", backgroundColor: "#fffbe6", fontWeight: "500" }}>
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
        <Tag style={{ borderRadius: "6px", padding: "2px 10px", border: "none", color: "#ff4d4f", backgroundColor: "#fff1f0", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Ort. Süre",
      dataIndex: "OrtSure",
      key: "OrtSure",
      align: "center",
      render: (value) => <Text style={{ color: "#434343" }}>{value}</Text>,
    },
    {
      title: "Toplam Maliyet",
      dataIndex: "ToplamMaliyet",
      key: "ToplamMaliyet",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600", color: "#000" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Son Arıza",
      dataIndex: "SonAriza",
      key: "SonAriza",
      align: "center",
      render: (value) => <Text style={{ color: "#595959" }}>{value}</Text>,
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
      {/* Üst Başlık ve Seçenekler Alanı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              2. En Çok Arızalananlar
            </Text>
            <Tag color="blue" style={{ marginLeft: "5px", color: "#1890ff", borderColor: "#91d5ff", backgroundColor: "#e6f7ff" }}>
              Kırılım Bazlı
            </Tag>
          </div>
          <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
            Seçilen kırılıma göre en çok arıza oluşturan alanlar
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", color: "#8c8c8c" }}>Kırılım</span>
          <Select
            value={breakdownType}
            onChange={(value) => onBreakdownTypeChange && onBreakdownTypeChange(value)}
            style={{ width: 150 }}
            size="small"
            options={[
              { value: 1, label: "Ekipman" },
              { value: 2, label: "Lokasyon" },
              { value: 3, label: "Atölye" },
              { value: 4, label: "Makine Tipi" },
            ]}
          />
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

      {/* TAM EKRAN MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PartitionOutlined />
            <span>2. En Çok Arızalananlar (Genişletilmiş Görünüm)</span>
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

      {/* BİLGİ MODAL */}
      <Modal
        title="Dağılım Listesi"
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
            <Text type="secondary">Kırılım bazlı iş yükü ve maliyet analizi yapar.</Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">Yüksek adet + yüksek maliyet = kritik alan.</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default IsEmriDagilimVePerformansListesi;