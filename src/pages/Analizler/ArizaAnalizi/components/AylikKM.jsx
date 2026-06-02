import React, { useMemo, useState } from "react";
import { Table, Spin, Typography, Tag, Button, Dropdown, Modal } from "antd";
import { PartitionOutlined, MoreOutlined } from "@ant-design/icons";

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
  const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  
  // Gelen JSON (Liste3) yapısını tam olarak karşılıyoruz kanka
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    return listeData.map((item, index) => ({
      key: index,
      Ekipman: item.Ekipman || "Belirsiz",
      ArizaTipi: item.ArizaTipi || "ARIZA",
      Tekrar: item.Tekrar || "0",
      IlkTarih: item.IlkTarih || "-",
      SonTarih: item.SonTarih || "-",
      OrtAralik: item.OrtAralik || "0 gün",
      ToplamDurus: item.ToplamDurus || "0 saat",
      ToplamMaliyet: item.ToplamMaliyet || "0,00",
      Risk: item.Risk || "Belirsiz",
    }));
  }, [listeData]);

  const calculatedTotal = useMemo(() => {
    if (totalItems === undefined || totalItems === null || totalItems === 0) {
      return data.length;
    }
    return totalItems;
  }, [data.length, totalItems]);

  const formatCurrencyString = (val) => {
    if (!val) return "₺0,00";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  // Dokümandaki kurala göre dinamik soft badge renklendirmesi kanka
  const getRiskTagStyles = (risk) => {
    const normalizeRisk = String(risk).toLowerCase();
    if (normalizeRisk.includes("yüksek")) {
      return { color: "#f5222d", backgroundColor: "#fff1f0", border: "none" };
    }
    if (normalizeRisk.includes("orta")) {
      return { color: "#fa8c16", backgroundColor: "#fff7e6", border: "none" };
    }
    return { color: "#389e0d", backgroundColor: "#f6ffed", border: "none" };
  };

  const columns = [
    {
      title: "Ekipman",
      dataIndex: "Ekipman",
      key: "Ekipman",
      render: (text) => <Text style={{ fontWeight: "500", color: "#1f2937" }}>{text}</Text>,
    },
    {
      title: "Arıza Tipi",
      dataIndex: "ArizaTipi",
      key: "ArizaTipi",
      align: "center",
      render: (text) => <Tag color="default">{text}</Tag>,
    },
    {
      title: "Tekrar Sayısı",
      dataIndex: "Tekrar",
      key: "Tekrar",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "12px", padding: "0 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff", fontWeight: "500" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "İlk Arıza",
      dataIndex: "IlkTarih",
      key: "IlkTarih",
      align: "center",
      render: (text) => <Text style={{ color: "#595959" }}>{text}</Text>,
    },
    {
      title: "Son Arıza",
      dataIndex: "SonTarih",
      key: "SonTarih",
      align: "center",
      render: (text) => <Text style={{ color: "#595959" }}>{text}</Text>,
    },
    {
      title: "Ort. Aralık",
      dataIndex: "OrtAralik",
      key: "OrtAralik",
      align: "center",
      render: (value) => <Text style={{ fontWeight: "500", color: "#434343" }}>{value}</Text>,
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
      title: "Toplam Maliyet",
      dataIndex: "ToplamMaliyet",
      key: "ToplamMaliyet",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600", color: "#000" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Risk Durumu",
      dataIndex: "Risk",
      key: "Risk",
      align: "center",
      render: (value) => (
        <Tag style={{ borderRadius: "10px", padding: "2px 12px", fontWeight: "600", ...getRiskTagStyles(value) }}>
          {value}
        </Tag>
      ),
    },
  ];

  const menuItems = [
    { key: "excel", label: "Excel İndir", onClick: () => onExportExcel?.() },
    { key: "fullscreen", label: "Tam Ekran Aç", onClick: () => setIsFullscreenModalVisible(true) },
    { key: "info", label: "Bilgi", onClick: () => setIsInfoModalVisible(true) }
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
      
      {/* Üst Başlık */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Text style={{ fontWeight: "600", fontSize: "16px" }}>
              3. Tekrarlayan Arıza Listesi
            </Text>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tag color="error" style={{ borderColor: "#ffa39e", backgroundColor: "#fff1f0", color: "#f5222d" }}>
            Kronik Arıza
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

      {/* Genişletilmiş Ekran Görünümü */}
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

      {/* Bilgi Modalı */}
      <Modal
        title="Arıza Analizi Bilgilendirme"
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={[<Button key="close" type="primary" onClick={() => setIsInfoModalVisible(false)}>Anladım</Button>]}
        centered
      >
        <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Ne işe yarar?</Text>
            <Text type="secondary">Aynı makinenin aynı arıza tipinden birden fazla bozulma durumunu listeler ve kronikleşmiş sorunları açığa çıkarır.</Text>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: "4px" }}>Nasıl Yorumlanmalı?</Text>
            <Text type="secondary">Kısa zaman aralığıyla (Ort. Aralık) tekrarlayan yüksek riskli alanlar acil kök neden analizi (RCA) gerektirir kanka.</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MakineArizaVeOncelikAnalizi;