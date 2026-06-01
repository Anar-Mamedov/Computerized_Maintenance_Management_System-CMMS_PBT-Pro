import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Select, Dropdown, Button, Tag, Modal } from "antd";
import { MoreOutlined, PartitionOutlined } from "@ant-design/icons";

const { Text } = Typography;

function ArızaMaliyetVeDuruşListesi({ 
  listeData, 
  loading, 
  kirilim4,
  onKirilim4Change, 
  page,
  pageSize,
  totalItems,
  onPageChange,
  onExportExcel
}) {
  const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  // Gelen ham Liste4 verilerini tam olarak eşliyoruz
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    
    return listeData.map((item, index) => ({
      key: index,
      KrilimAdi: item.GrupAdi || "Belirsiz",
      ArizaSayisi: item.ArizaSayisi || "0",
      ToplamMaliyet: item.ToplamMaliyet || "0,00",
      OrtMaliyet: item.OrtMaliyet || "0,00",
      ToplamDurus: item.ToplamDurus ? (String(item.ToplamDurus).includes("saat") ? item.ToplamDurus : `${item.ToplamDurus} saat`) : "0 saat",
      OrtDurus: item.OrtDurus ? (String(item.OrtDurus).includes("saat") ? item.OrtDurus : `${item.OrtDurus} saat`) : "0 saat",
      Oncelik: item.Oncelik || "Belirsiz"
    }));
  }, [listeData]);

  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems]);

  // Dokümana göre para birimini frontend'de ekliyoruz reyiz
  const formatCurrencyString = (val) => {
    if (!val) return "₺0,00";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };
  
  // Seçilen Kirilim4 değerine göre dinamik başlık
  const getBreakdownLabel = () => {
    if (kirilim4 === 1 || kirilim4 === "Tip") return "Ekipman";
    if (kirilim4 === 2) return "Lokasyon";
    if (kirilim4 === 3) return "Atölye";
    if (kirilim4 === 4) return "Ekipman Tipi";
    return "Ekipman";
  };

  // Entegrasyon notlarındaki soft badge renklendirme kuralı kanka
  const getOncelikTagStyles = (oncelik) => {
    const normalizeOncelik = String(oncelik).toLowerCase();
    if (normalizeOncelik.includes("yüksek")) {
      return { color: "#ff4d4f", backgroundColor: "#fff1f0", border: "none" };
    }
    if (normalizeOncelik.includes("orta")) {
      return { color: "#fa8c16", backgroundColor: "#fff7e6", border: "none" };
    }
    if (normalizeOncelik.includes("düşük")) {
      return { color: "#52c41a", backgroundColor: "#f6ffed", border: "none" };
    }
    return { color: "#1890ff", backgroundColor: "#e6f7ff", border: "none" };
  };

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
      title: "Toplam Duruş",
      dataIndex: "ToplamDurus",
      key: "ToplamDurus",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "6px", padding: "2px 10px", border: "none", color: "#ff4d4f", backgroundColor: "#fff1f0", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Ort. Duruş",
      dataIndex: "OrtDurus",
      key: "OrtDurus",
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
      title: "Ort. Maliyet",
      dataIndex: "OrtMaliyet",
      key: "OrtMaliyet",
      align: "right",
      render: (value) => <Text style={{ color: "#434343" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Öncelik",
      dataIndex: "Oncelik",
      key: "Oncelik",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "10px", padding: "2px 12px", fontWeight: "600", ...getOncelikTagStyles(value) }}>
          {value}
        </Tag>
      ),
    },
  ];

  const menuItems = [
    { key: "download", label: "Excel İndir", onClick: () => onExportExcel?.() },
    { key: "fullscreen", label: "Tam Ekran Aç", onClick: () => setIsFullscreenModalVisible(true) },
    { key: "info", label: "Bilgi", onClick: () => setIsInfoModalVisible(true) },
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
          onPageChange?.(currentPage, currentPageSize);
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
              4. Arıza Maliyet & Duruş Listesi
            </Text>
            <Tag color="blue" style={{ marginLeft: "5px", color: "#1890ff", borderColor: "#91d5ff", backgroundColor: "#e6f7ff" }}>
              Maliyet + Duruş
            </Tag>
          </div>
          <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
            Seçilen kırılıma göre en yüksek maliyet ve duruş riski oluşturan alanlar
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", color: "#8c8c8c" }}>Kırılım</span>
          <Select
            value={kirilim4}
            onChange={(value) => onKirilim4Change && onKirilim4Change(value)}
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
            <span>4. Arıza Maliyet & Duruş Listesi (Genişletilmiş Görünüm)</span>
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
        title="Maliyet & Duruş Listesi Analizi"
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={[<Button key="close" type="primary" onClick={() => setIsInfoModalVisible(false)}>Anladım</Button>]}
        centered
      >
        <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Ne işe yarar?</Text>
            <Text type="secondary">Maliyet ve duruş sürelerinin toplam etkilerine bakarak en kritik odaklanılması gereken alanları listeler.</Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Öncelik Etiketleri Nasıl Hesaplanır?</Text>
            <Text type="secondary">Hem yüksek duruş kaybı yaşatan hem de maliyet yükü bindiren kırılımlar sistem tarafından otomatik olarak 'Yüksek Öncelikli' olarak işaretlenir.</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ArızaMaliyetVeDuruşListesi;