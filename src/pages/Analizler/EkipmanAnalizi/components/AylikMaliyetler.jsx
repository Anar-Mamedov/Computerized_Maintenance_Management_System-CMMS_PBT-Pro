import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Dropdown, Button, Tag, Modal } from "antd";
import { MoreOutlined, PartitionOutlined } from "@ant-design/icons";

const { Text } = Typography;

function YedekParcaAnalizListesi({ 
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
  
  // API'den gelen `Liste4` verilerini Ant Design Table hücrelerine map'liyoruz kanka
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    
    return listeData.map((item, index) => ({
      key: index,
      yedekParca: item.YedekParca || "-",
      kullanim: item.Kullanim || "0",
      ekipmanSayisi: item.EkipmanSayisi || "0",
      enCokKullanilan: item.EnCokKullanilan || "-",
      toplamMaliyet: item.ToplamMaliyet || "0,00",
      ortBirim: item.OrtBirim || "0,00",
      sonKullanim: item.SonKullanim || "-",
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
    if (!val || val === "0,00" || val === "0") return "₺0";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  // Görseldeki sütun dizilimine ve sağa/sola hizalama parametrelerine %100 sadık kalınan kolonlar
  const columns = [
    {
      title: "Yedek Parça",
      dataIndex: "yedekParca",
      key: "yedekParca",
      align: "left",
      render: (text) => <Text strong style={{ color: "#111827" }}>{text}</Text>,
    },
    {
      title: "Kullanım",
      dataIndex: "kullanim",
      key: "kullanim",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "12px", padding: "2px 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Ekipman Sayısı",
      dataIndex: "ekipmanSayisi",
      key: "ekipmanSayisi",
      align: "center",
    },
    {
      title: "En Çok Kullanılan",
      dataIndex: "enCokKullanilan",
      key: "enCokKullanilan",
      align: "left",
    },
    {
      title: "Toplam Maliyet",
      dataIndex: "toplamMaliyet",
      key: "toplamMaliyet",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600", color: "#1f2937" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Ort. Birim",
      dataIndex: "ortBirim",
      key: "ortBirim",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600", color: "#1f2937" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Son Kullanım",
      dataIndex: "sonKullanim",
      key: "sonKullanim",
      align: "center",
      render: (text) => <Text type="secondary">{text}</Text>,
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
              Yedek Parça Tüketim Listesi
            </Text>
          </div>
        </div>

        {/* Sağ Taraf: Aksiyon Butonu */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tag color="blue" style={{ color: "#1890ff", borderColor: "#91d5ff", backgroundColor: "#e6f7ff", fontWeight: "500" }}>
            Stok Etkisi
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
            <span>Yedek Parça Tüketim Listesi (Genişletilmiş Görünüm)</span>
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
            <span>Yedek Parça Analizi</span>
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
              Bakım ve arıza operasyonlarında kullanılan yedek parçaların bütçe ve sarfiyat yoğunluğunu listeler.
            </Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">
              Kullanım adedi yüksek ve en son yakın tarihte işlem görmüş parçalar hızlı devir hızına sahip kritik sarf malzemeleridir.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default YedekParcaAnalizListesi;