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
  // Kanka 4. tabloya özel bağımsız sayfalama propları buraya eklendi:
  page,
  pageSize,
  totalItems,
  onPageChange
}) {
  
  // Gelen ham veriyi (Liste4 yapısına göre) güvenli bir şekilde map'liyoruz
  const data = useMemo(() => {
    if (!listeData || !Array.isArray(listeData)) return [];
    
    return listeData.map((item, index) => ({
      key: index,
      GrupAdi: item.GrupAdi || "Belirsiz",
      ToplamIs: item.ToplamIs || "0",
      AcikIs: item.AcikIs || "0",
      GecikmeOrani: item.GecikmeOrani || "%0",
      Zamaninda: item.Zamaninda || "%100",
      ToplamCalisma: item.ToplamCalisma || "0 saat",
      DurusSuresi: item.DurusSuresi || "0 saat",
      OrtTamamlama: item.OrtTamamlama || "0,0 gün",
      ToplamMaliyet: item.ToplamMaliyet || "0,00",
      YenidenIslem: item.YenidenIslem || "0",
    }));
  }, [listeData]);

  const menuItems = [
    { key: "refresh", label: "Verileri Yenile", onClick: onRefresh },
    { key: "download", label: "Excel İndir" },
    { key: "info", label: "Bilgi" },
  ];

  // API'den gelen formatlı string para biriminin başına ₺ ekleyen fonksiyon
  const formatCurrencyString = (val) => {
    if (!val || val === "0,00" || val === "0") return "₺0";
    if (String(val).includes("₺")) return val;
    return `₺${val}`;
  };

  const columns = [
    {
      title: "Grup Adı",
      dataIndex: "GrupAdi",
      key: "GrupAdi",
      render: (text) => <Text style={{ fontWeight: "500" }}>{text}</Text>,
    },
    {
      title: "Toplam İş",
      dataIndex: "ToplamIs",
      key: "ToplamIs",
      align: "center",
      render: (value) => (
        <Tag color="blue" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#1890ff", backgroundColor: "#e6f7ff" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Açık İş",
      dataIndex: "AcikIs",
      key: "AcikIs",
      align: "center",
      render: (value) => (
        <Tag color="warning" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#fa8c16", backgroundColor: "#fff7e6" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Gecikme Oranı",
      dataIndex: "GecikmeOrani",
      key: "GecikmeOrani",
      align: "center",
      render: (value) => (
        <Tag color="error" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#f5222d", backgroundColor: "#fff1f0", fontWeight: "600" }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Zamanında",
      dataIndex: "Zamaninda",
      key: "Zamaninda",
      align: "center",
      render: (value) => (
        <Tag color="success" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#52c41a", backgroundColor: "#f6ffed", fontWeight: "600" }}>
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
      title: "Duruş Süresi",
      dataIndex: "DurusSuresi",
      key: "DurusSuresi",
      align: "center",
      render: (value) => (
        <Tag color="volcano" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#fa541c", backgroundColor: "#fff2e8" }}>
          {value}
        </Tag>
      ),
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
      title: "Toplam Maliyet",
      dataIndex: "ToplamMaliyet",
      key: "ToplamMaliyet",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600" }}>{formatCurrencyString(value)}</Text>,
    },
    {
      title: "Yeniden İşlem",
      dataIndex: "YenidenIslem",
      key: "YenidenIslem",
      align: "center",
      render: (value) => (
        <Tag color="purple" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#722ed1", backgroundColor: "#f9f0ff" }}>
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
              4. Atölye Performans Karşılaştırması
            </Text>
            <Tag color="purple" style={{ marginLeft: "5px", color: "#722ed1", borderColor: "#d3adf7", backgroundColor: "#f9f0ff" }}>
              Performans
            </Tag>
          </div>
          <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
            Atölyelerin iş yükü, gecikme, süre, maliyet ve verimlilik karşılaştırması
          </Text>
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
            // 4. Tablo için dinamik bağımsız sayfalama motoru:
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