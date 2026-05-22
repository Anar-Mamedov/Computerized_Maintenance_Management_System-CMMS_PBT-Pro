import React, { useMemo } from "react";
import { Table, Spin, Typography, Tag } from "antd";
import { PartitionOutlined } from "@ant-design/icons";

const { Text } = Typography;

function IsEmriMaliyetVePerformansAnalizi({ 
  listeData, 
  loading,
  // Bağımsız sayfalama propları eklendi kanka
  page,
  pageSize,
  totalItems,
  onPageChange
}) {
  
  // Gelen JSON yapısındaki (Liste2) verilerini Ant Design Table formatına güvenle map'liyoruz
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

  // API'den gelen formatlı para string değerlerinin başına güvenle ₺ ekler
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
              2. İş Emirleri Maliyet ve Performans Analizi
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
            Malzeme, işçilik, dış servis and toplam maliyet performansı
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tag color="blue" style={{ marginLeft: "5px", color: "#1890ff", borderColor: "#91d5ff", backgroundColor: "#e6f7ff" }}>
            Maliyet
          </Tag>
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

export default IsEmriMaliyetVePerformansAnalizi;