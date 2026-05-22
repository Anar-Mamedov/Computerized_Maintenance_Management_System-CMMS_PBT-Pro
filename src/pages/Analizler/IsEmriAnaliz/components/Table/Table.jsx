import React, { useMemo } from "react";
import { Table, Spin, Typography, Select, Dropdown, Button, Tag } from "antd";
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
  onPageChange
}) {
  
  // Gelen ham veriyi güvenli bir şekilde filtreleyip tabloya hazır hale getiriyoruz
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    
    return listeData.map((item, index) => ({
      key: index,
      KrilimAdi: item.GrupAdi || "Belirsiz",
      IsEmriSayisi: item.IsEmriSayisi || "0",
      ToplamCalisma: item.ToplamCalisma || "0 saat",
      ToplamMaliyet: item.ToplamMaliyet || "0,00",
      OrtMaliyet: item.OrtMaliyet || "0,00",
      OrtTamamlama: item.OrtTamamlama || "0,0 gün",
      EnYuksek: item.EnYuksek || "0,00",
      EnDusuk: item.EnDusuk || "0,00",
      Siklik: item.Siklik || "-",
    }));
  }, [listeData]);

  const menuItems = [
    { key: "refresh", label: "Verileri Yenile", onClick: onRefresh },
    { key: "download", label: "Excel İndir" },
    { key: "info", label: "Bilgi" },
  ];

  const formatCurrencyString = (val) => {
    if (!val) return "₺0,00";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };
  
  const getBreakdownLabel = () => {
    if (breakdownType === 1) return "İş Emri Tipleri";
    if (breakdownType === 2) return "Lokasyonlar";
    if (breakdownType === 3) return "Ekipman Tipleri";
    if (breakdownType === 4) return "Atölyeler";
    return "Kırılım Başlığı";
  };

  const columns = [
    {
      title: getBreakdownLabel(),
      dataIndex: "KrilimAdi",
      key: "KrilimAdi",
      render: (text) => <Text style={{ fontWeight: "500" }}>{text}</Text>,
    },
    {
      title: "İş Emri",
      dataIndex: "IsEmriSayisi",
      key: "IsEmriSayisi",
      align: "center",
      render: (value) => (
        <Tag color="blue" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Toplam Çalışma",
      dataIndex: "ToplamCalisma",
      key: "ToplamCalisma",
      align: "center",
      render: (value) => (
        <Tag color="geekblue" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#2f54eb", backgroundColor: "#f0f5ff" }}>
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
      title: "Ort. Maliyet",
      dataIndex: "OrtMaliyet",
      key: "OrtMaliyet",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
    {
      title: "Ort. Tamamlama",
      dataIndex: "OrtTamamlama",
      key: "OrtTamamlama",
      align: "center",
      render: (value) => (
        <Tag color="cyan" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#13c2c2", backgroundColor: "#e6fffb" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "En Yüksek",
      dataIndex: "EnYuksek",
      key: "EnYuksek",
      align: "right",
      render: (value) => formatCurrencyString(value),
    },
    {
      title: "En Düşük",
      dataIndex: "EnDusuk",
      key: "EnDusuk",
      align: "right",
      render: (value) => formatCurrencyString(value),
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
  ];

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
              1. İş Emri Dağılım ve Performans Listesi
            </Text>
            <Tag color="blue" style={{ marginLeft: "5px", color: "#1890ff", borderColor: "#91d5ff", backgroundColor: "#e6f7ff" }}>
              Kırılım Bazlı
            </Tag>
          </div>
          <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
            Seçilen kırılıma göre iş yükü, süre ve maliyet analizi
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
              { value: 1, label: "İş Emri Tipleri" },
              { value: 2, label: "Lokasyon" },
              { value: 3, label: "Ekipman Tipleri" },
              { value: 4, label: "Atölyeler" },
            ]}
          />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Tablo Alanı */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={data}
            size="middle"
            bordered={false}
            // Kanka dinamik sayfalama ayarları tam burası:
            pagination={{
              current: page,
              pageSize: pageSize,
              total: totalItems || 0,
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
        </Spin>
      </div>
    </div>
  );
}

export default IsEmriDagilimVePerformansListesi;