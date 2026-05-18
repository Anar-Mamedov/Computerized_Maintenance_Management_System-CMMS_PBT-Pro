import React, { useState, useEffect, useCallback } from "react";
import { Table, Spin, Typography, Select, Dropdown, Button, Tag } from "antd";
import { MoreOutlined, PartitionOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

function IsEmriDagilimVePerformansListesi() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [breakdownType, setBreakdownType] = useState("Tip"); // Tip, Durum, Atolye vb.
  const { watch } = useFormContext();

  const lokasyonId = watch("locationIds1");
  const atolyeId = watch("atolyeIds1");
  const baslangicTarihi = watch("baslangicTarihi1");
  const bitisTarihi = watch("bitisTarihi1");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      BaslangicTarih: baslangicTarihi ? dayjs(baslangicTarihi).format("YYYY-MM-DD") : "",
      BitisTarih: bitisTarihi ? dayjs(bitisTarihi).format("YYYY-MM-DD") : "",
      BreakdownType: breakdownType, // Seçilen kırılıma göre backend'e bilgi geçiyoruz
    };

    try {
      const response = await AxiosInstance.post(``, body);
      const formattedData = response.map((item, index) => ({
        key: index,
        KrilimAdi: item.KrilimAdi || "Belirsiz",
        IsEmriSayisi: item.IsEmriSayisi || 0,
        ToplamCalisma: item.ToplamCalisma || 0,
        ToplamMaliyet: item.ToplamMaliyet || 0,
        OrtMaliyet: item.OrtMaliyet || 0,
        OrtTamamlama: item.OrtTamamlama || 0,
        EnYuksek: item.EnYuksek || 0,
        EnDusuk: item.EnDusuk || 0,
        Siklik: item.Siklik || "-",
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Performans listesi verisi çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lokasyonId, atolyeId, baslangicTarihi, bitisTarihi, breakdownType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const menuItems = [
    { key: "refresh", label: "Verileri Yenile", onClick: fetchData },
    { key: "download", label: "Excel İndir" },
    { key: "info", label: "Bilgi" },
  ];

  // Fotoğraftaki gibi esnek ve soft renkli kapsül tasarımları için yardımcı fonksiyonlar
  const formatCurrency = (value) => `₺${new Intl.NumberFormat("tr-TR").format(value)}`;
  
  const getBreakdownLabel = () => {
    if (breakdownType === "Tip") return "İş Emri Tipleri";
    if (breakdownType === "Durum") return "Durumlar";
    if (breakdownType === "Atolye") return "Atölyeler";
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
          {value} saat
        </Tag>
      ),
    },
    {
      title: "Toplam Maliyet",
      dataIndex: "ToplamMaliyet",
      key: "ToplamMaliyet",
      align: "right",
      render: (value) => <Text style={{ fontWeight: "600" }}>{formatCurrency(value)}</Text>,
    },
    {
      title: "Ort. Maliyet",
      dataIndex: "OrtMaliyet",
      key: "OrtMaliyet",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Ort. Tamamlama",
      dataIndex: "OrtTamamlama",
      key: "OrtTamamlama",
      align: "center",
      render: (value) => (
        <Tag color="cyan" style={{ borderRadius: "10px", padding: "0 10px", border: "none", color: "#13c2c2", backgroundColor: "#e6fffb" }}>
          {value} gün
        </Tag>
      ),
    },
    {
      title: "En Yüksek",
      dataIndex: "EnYuksek",
      key: "EnYuksek",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "En Düşük",
      dataIndex: "EnDusuk",
      key: "EnDusuk",
      align: "right",
      render: (value) => formatCurrency(value),
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
            <Tag color="blue" variant="light" style={{ marginLeft: "5px", color: "#1890ff", borderColor: "#91d5ff" }}>
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
            onChange={(value) => setBreakdownType(value)}
            style={{ width: 150 }}
            size="small"
            options={[
              { value: "Tip", label: "İş Emri Tipleri" },
              { value: "Durum", label: "Durumlar" },
              { value: "Atolye", label: "Atölyeler" },
            ]}
          />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Tablo Alanı */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            size="middle"
            bordered={false}
            rowStyle={{ height: "50px" }}
          />
        </Spin>
      </div>
    </div>
  );
}

export default IsEmriDagilimVePerformansListesi;