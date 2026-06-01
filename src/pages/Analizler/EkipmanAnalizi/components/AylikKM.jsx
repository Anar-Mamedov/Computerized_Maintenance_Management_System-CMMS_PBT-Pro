import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Tag, Button, Dropdown, Modal } from "antd";
import { PartitionOutlined, MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

function MakineArizaAnalizListesi({ 
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
  
  // API'den gelen `Liste3` verilerini Ant Design Table hücrelerine map'liyoruz kanka
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    return listeData.map((item, index) => ({
      key: index,
      ekipman: item.Ekipman || "Belirsiz",
      yas: item.Yas || "0 yıl",
      tip: item.Tip || "-",
      ariza: item.Ariza || "0",
      arizaSikligi: item.ArizaSikligi || "-",
      ortCozum: item.OrtCozum || "0 saat",
      toplamDurus: item.ToplamDurus || "0 saat",
      arizaMaliyeti: item.ArizaMaliyeti || "0,00",
    }));
  }, [listeData]);

  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems]);

  // Para birimi string değerlerinin önüne Türk Lirası simgesini görseldeki gibi yerleştiriyoruz
  const formatCurrencyString = (val) => {
    if (!val) return "₺0,00";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  // Görseldeki sütun dizilimine ve sağa/sola hizalama parametrelerine %100 sadık kalınan kolonlar
  const columns = [
    {
      title: "Ekipman",
      dataIndex: "ekipman",
      key: "ekipman",
      align: "left",
      render: (text) => <Text strong style={{ color: "#111827" }}>{text}</Text>,
    },
    {
      title: "Yaş",
      dataIndex: "yas",
      key: "yas",
      align: "center",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Tip",
      dataIndex: "tip",
      key: "tip",
      align: "left",
      render: (text) => <Text type="secondary">{text}</Text>,
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
      title: "Arıza Sıklığı",
      dataIndex: "arizaSikligi",
      key: "arizaSikligi",
      align: "left",
    },
    {
      title: "Ort. Çözüm",
      dataIndex: "ortCozum",
      key: "ortCozum",
      align: "center",
    },
    {
      title: "Toplam Duruş",
      dataIndex: "toplamDurus",
      key: "toplamDurus",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "12px", padding: "2px 10px", border: "none", color: "#fa8c16", backgroundColor: "#fff7e6", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Arıza Maliyeti",
      dataIndex: "arizaMaliyeti",
      key: "arizaMaliyeti",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600", color: "#1f2937" }}>{formatCurrencyString(value)}</Text>,
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
      {/* Üst Başlık ve Aksiyon Alanı */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              Ekipman Yaş ve Arıza Listesi
            </Text>
          </div>
        </div>

        {/* Sağ Üst Köşe Aksiyon Noktası */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tag color="red" style={{ color: "#f5222d", borderColor: "#ffa39e", backgroundColor: "#fff1f0", fontWeight: "500" }}>
            Yaş + Arıza
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

      {/* Tam Ekran Detay Görünüm Modalı */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PartitionOutlined />
            <span>Ekipman Yaş ve Arıza Listesi (Genişletilmiş Ekran)</span>
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
        title="Arıza Frekans Analizi"
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
              Makinelerin hangi zaman aralıklarında (MTBF - Arızalar Arası Ortalama Süre mantığında) tekrarlı hata verdiğini ve üretim hatlarını ne kadar süreyle alıkoyduğunu gösterir.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">
              "Arıza Sıklığı" düşük gün periyoduna sahip (örn: 3 günde bir arızalanan) ve "Toplam Duruş" süresi yüzlerce saati bulan ekipmanlar planlı bakıma hemen alınmalıdır.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MakineArizaAnalizListesi;