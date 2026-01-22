import React, { useState, useMemo } from "react";
import { Typography, Table, Input, Tag, Badge, Button, Space } from "antd";
import { SearchOutlined, FilterOutlined, RightCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// --- MOCK VERİLER ---
const initialData = [
  {
    key: "1",
    tarih: "2025-12-12",
    santiye: "Şantiye-2",
    tip: "Yakıt",
    aciklama: "OPET otomatik fiş (Toplu)",
    tutar: 420000,
    durum: "Onaylandı", // Varsayılan
  },
  {
    key: "2",
    tarih: "2025-12-11",
    santiye: "Şantiye-1",
    tip: "Bakım",
    aciklama: "Plan dışı arıza – hidrolik",
    tutar: 310000,
    durum: "Onaylandı",
  },
  {
    key: "3",
    tarih: "2025-12-10",
    santiye: "Şantiye-3",
    tip: "Parça",
    aciklama: "Filtre / sarf malzeme",
    tutar: 185000,
    durum: "Onaylandı",
  },
  {
    key: "4",
    tarih: "2025-12-09",
    santiye: "Şantiye-2",
    tip: "Taşeron",
    aciklama: "Forklift kiralama",
    tutar: 260000,
    durum: "Bekliyor", // Prompt'taki özel durum
  },
  {
    key: "5",
    tarih: "2025-12-08",
    santiye: "Şantiye-1",
    tip: "Diğer",
    aciklama: "Lojistik",
    tutar: 95000,
    durum: "Onaylandı",
  },
];

// Tip Renkleri
const typeColors = {
  Yakıt: "volcano",
  Bakım: "blue",
  Parça: "gold",
  Taşeron: "cyan",
  Diğer: "default",
};

const AylikBakimMaliyetleri = () => {
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tümü");

  // Filtreleme Seçenekleri
  const filterOptions = ["Tümü", "Yakıt", "Bakım", "Parça", "Taşeron", "Diğer"];

  // Tablo Kolonları
  const columns = [
    {
      title: "Tarih",
      dataIndex: "tarih",
      key: "tarih",
      width: 120,
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Şantiye",
      dataIndex: "santiye",
      key: "santiye",
      width: 120,
    },
    {
      title: "Tip",
      dataIndex: "tip",
      key: "tip",
      width: 100,
      render: (type) => (
        <Tag color={typeColors[type] || "default"} style={{ marginRight: 0 }}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "aciklama",
      key: "aciklama",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {record.durum === "Bekliyor" && <Badge status="processing" text="Bekliyor" />}
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: "Tutar",
      dataIndex: "tutar",
      key: "tutar",
      align: "right",
      width: 120,
      render: (value) => (
        <Text strong>
          ₺{value.toLocaleString("tr-TR")}
        </Text>
      ),
    },
  ];

  // Veriyi Filtrele
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      // 1. Kategori Filtresi
      const categoryMatch = activeFilter === "Tümü" || item.tip === activeFilter;

      // 2. Arama Filtresi (Açıklama veya Şantiye içinde ara)
      const searchMatch =
        item.aciklama.toLowerCase().includes(searchText.toLowerCase()) ||
        item.santiye.toLowerCase().includes(searchText.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [searchText, activeFilter]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        gap: "15px",
      }}
    >
      {/* --- HEADER --- */}
      <div>
        <Title level={4} style={{ margin: 0, color: "#1f1f1f" }}>
          Maliyet Kayıtları
        </Title>
        <Text type="secondary" style={{ fontSize: "13px" }}>
          Maliyet tipine göre filtrele, hızlı arama yap, satırdan detaya in
        </Text>
      </div>

      {/* --- TOOLBAR (Filtreler ve Arama) --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        
        {/* Kategori Butonları */}
        <div style={{ display: "flex", gap: "5px", overflowX: "auto", paddingBottom: "5px" }}>
          {filterOptions.map((option) => (
            <Button
              key={option}
              type={activeFilter === option ? "primary" : "default"}
              size="small"
              shape="round"
              onClick={() => setActiveFilter(option)}
              style={{ fontSize: "12px" }}
            >
              {option}
            </Button>
          ))}
        </div>

        {/* Arama Kutusu */}
        <Input
          placeholder="Ara..."
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px", borderRadius: "20px" }}
          allowClear
        />
      </div>

      {/* --- TABLO --- */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          size="middle"
          rowKey="key"
          onRow={() => ({
            style: { cursor: "pointer" },
            onClick: () => {
                // Mock tıklama aksiyonu
                console.log("Satıra tıklandı");
            }
          })}
        />
      </div>

      {/* --- FOOTER --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Toplam kayıt: <strong style={{ color: "#595959" }}>{filteredData.length}</strong>
        </Text>
        
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#8c8c8c", fontSize: "11px" }}>
          <RightCircleOutlined />
          <span>İpucu: Satıra tıklayınca ilgili modüle iner (mock)</span>
        </div>
      </div>
    </div>
  );
};

export default AylikBakimMaliyetleri;