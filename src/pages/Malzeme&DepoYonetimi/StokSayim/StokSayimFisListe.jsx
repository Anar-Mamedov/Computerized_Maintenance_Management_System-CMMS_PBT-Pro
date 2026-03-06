import React, { useMemo, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Select,
  Modal,
  Checkbox,
  Card,
  Space,
  Typography,
  Tooltip,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  FileTextOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import StokSayimFisDetay from "./StokSayimFisDetay";

const { Text, Title } = Typography;

/**
 * Stok Sayım Fişleri Listesi – Ant Design Versiyonu
 */

const demoReceipts = [
  {
    key: "125",
    id: 125,
    countNo: "SYM-2026-00125",
    title: "Stok Sayım Fişi",
    state: "open",
    warehouse: "Merkez + Atölye",
    kind: "Genel",
    startedAt: "04.01.2026 10:30",
    createdBy: "Erhan Çevik",
    itemCount: 6,
    diffCount: 3,
  },
  {
    key: "126",
    id: 126,
    countNo: "SYM-2026-00126",
    title: "Stok Sayım Fişi",
    state: "open",
    warehouse: "Merkez Depo",
    kind: "Devir",
    startedAt: "03.01.2026 09:10",
    createdBy: "Depo Sorumlusu",
    itemCount: 18,
    diffCount: 0,
  },
  {
    key: "110",
    id: 110,
    countNo: "SYM-2025-00110",
    title: "Stok Sayım Fişi",
    state: "closed",
    warehouse: "Atölye Depo",
    kind: "Aylık",
    startedAt: "15.12.2025 14:00",
    endedAt: "15.12.2025 17:20",
    createdBy: "Depo Yöneticisi",
    itemCount: 42,
    diffCount: 5,
  },
];

export default function AntDStockCountList() {
  const [data, setData] = useState(demoReceipts);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("open");
  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [targetReceipt, setTargetReceipt] = useState(null);
  const [isAck, setIsAck] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Sayım Kapatma İşlemi
  const handleCloseReceipt = () => {
    if (!isAck) return;
    
    setData(prev => 
      prev.map(item => 
        item.id === targetReceipt.id 
          ? { ...item, state: 'closed', endedAt: new Date().toLocaleString('tr-TR') } 
          : item
      )
    );
    
    message.success(`${targetReceipt.countNo} başarıyla kapatıldı.`);
    setCloseModalVisible(false);
    setIsAck(false);
  };

  const columns = [
    {
      title: "Sayım No",
      key: "countNo",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text 
            strong 
            style={{ color: '#1890ff', cursor: 'pointer', fontSize: '15px' }}
            onClick={() => {
              setSelectedReceipt(record);
              setIsDetailOpen(true);
            }}
          >
            {record.countNo}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.title}</Text>
        </Space>
      ),
    },
    {
      title: "Durum",
      dataIndex: "state",
      key: "state",
      render: (state) => (
        state === "open" ? 
        <Tag color="processing" icon={<ClockCircleOutlined />}>Açık</Tag> : 
        <Tag color="error" icon={<CheckCircleOutlined />}>Kapalı</Tag>
      ),
    },
    {
      title: "Depo",
      key: "warehouseKind",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong><EnvironmentOutlined /> {record.warehouse}</Text>
        </Space>
      ),
    },
    {
      title: "Tür",
      key: "warehouseKind",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong><EnvironmentOutlined /> {record.kind}</Text>
        </Space>
      ),
    },
    {
      title: "Başlangıç",
      key: "dates",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: '13px' }}>{record.startedAt}</Text>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {record.startedAt ? record.startedAt : "—"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Bitiş",
      key: "dates",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: '13px' }}>{record.endedAt}</Text>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {record.endedAt ? record.endedAt : "—"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Kalem",
      key: "counts",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.itemCount}</Text>
        </Space>
      ),
    },
    {
      title: "Fark",
      key: "counts",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text type={record.diffCount > 0 ? "danger" : "success"} style={{ fontSize: '12px' }}>
            {record.diffCount > 0 ? `${record.diffCount} farklı kalem` : "tam uyum"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Açan",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#bfbfbf' }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "İşlem",
      key: "action",
      align: "right",
      render: (_, record) => (
        record.state === "open" ? (
          <Button 
            danger 
            type="primary"
            ghost
            size="middle" 
            onClick={() => {
              setTargetReceipt(record);
              setCloseModalVisible(true);
            }}
          >
            Kapat
          </Button>
        ) : (
          <Button icon={<EyeOutlined />} size="middle">Görüntüle</Button>
        )
      ),
    },
  ];

  const filteredData = data.filter(item => {
    const matchSearch = item.countNo.toLowerCase().includes(searchText.toLowerCase()) || 
                        item.warehouse.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === "all" ? true : item.state === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ 
      padding: "20px 2%", // Padding'i yüzdeye çevirdik, kenarlardan her zaman nefes alır
      background: "#f0f2f5", 
      minHeight: "100vh" 
    }}>
      <div style={{ maxWidth: 1800, margin: "0 auto", width: '100%' }}>
        
        {/* Üst Başlık Alanı */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Space>
            <div style={{ background: '#fff', padding: 8, borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>BELGE YÖNETİMİ</Text>
              <Title level={4} style={{ margin: 0 }}>Stok Sayım Fişleri</Title>
            </div>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} size="large" shape="round">
            Yeni Sayım
          </Button>
        </div>

        {/* Filtreler Kartı */}
        <Card size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
            <Space flexWrap="wrap">
              <Input
                placeholder="Sayım no veya depo ara..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                style={{ width: 250, borderRadius: 8 }}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              <Select
                defaultValue="open"
                style={{ width: 150 }}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'Tüm Sayımlar' },
                  { value: 'open', label: 'Sadece Açık' },
                  { value: 'closed', label: 'Sadece Kapalı' },
                ]}
              />
              <Button icon={<FilterOutlined />}>Gelişmiş Filtre</Button>
            </Space>
            <Text type="secondary">Toplam {filteredData.length} kayıt listeleniyor</Text>
          </div>
        </Card>

        {/* Tablo Kartı */}
        <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>
      </div>

      {/* Sayım Kapatma Modalı */}
      <Modal
        title={
          <Space>
            <LockOutlined style={{ color: '#ff4d4f' }} />
            <span>Sayımı Kapat ve Kilitle</span>
          </Space>
        }
        open={closeModalVisible}
        onCancel={() => {
          setCloseModalVisible(false);
          setIsAck(false);
        }}
        footer={[
          <Button key="back" onClick={() => setCloseModalVisible(false)}>Vazgeç</Button>,
          <Button 
            key="submit" 
            type="primary" 
            danger 
            disabled={!isAck}
            onClick={handleCloseReceipt}
            icon={<LockOutlined />}
          >
            Sayımı Sonlandır
          </Button>,
        ]}
      >
        {targetReceipt && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card size="small" className="bg-gray-50">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <Text type="secondary" size="small">Fiş No</Text>
                  <div><Text strong>{targetReceipt.countNo}</Text></div>
                </div>
                <div>
                  <Text type="secondary" size="small">Farklı Kalem</Text>
                  <div><Text danger strong>{targetReceipt.diffCount} Kalem</Text></div>
                </div>
              </div>
            </Card>

            <div style={{ background: '#fffbe6', padding: 12, borderRadius: 8, border: '1px solid #ffe58f' }}>
              <Space align="start">
                <ExclamationCircleOutlined style={{ color: '#faad14', marginTop: 4 }} />
                <Text size="small">
                  Bu işlem geri alınamaz. Sayım kapatıldığında stok bakiyeleri güncellenecek ve fiş üzerinde değişiklik yapılamayacaktır.
                </Text>
              </Space>
            </div>

            <Input.TextArea rows={3} placeholder="Kapanış notu ekleyebilirsiniz..." />

            <Checkbox checked={isAck} onChange={e => setIsAck(e.target.checked)}>
              Verilerin doğruluğunu onaylıyorum ve stokları güncellemek istiyorum.
            </Checkbox>
          </Space>
        )}
      </Modal>
      <StokSayimFisDetay 
  visible={isDetailOpen} 
  onClose={() => setIsDetailOpen(false)} 
  receiptData={selectedReceipt} 
/>
    </div>
  );
}