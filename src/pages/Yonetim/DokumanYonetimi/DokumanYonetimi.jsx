import React, { useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Badge,
  Modal,
  Drawer,
  Checkbox,
  Dropdown,
  message,
  Card,
  Typography,
  Tooltip,
  Upload,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  FilePdfOutlined,
  HistoryOutlined,
  LinkOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { Dragger } = Upload;

// -------------------- Mock Data & Helpers --------------------
const STATUS_MAP = {
  approved: { color: "success", label: "Onaylı" },
  review: { color: "processing", label: "Onayda" },
  expired: { color: "error", label: "Süresi Doldu" },
  archived: { color: "warning", label: "Arşiv" },
  draft: { color: "default", label: "Taslak" },
};

const DOC_TYPES = ["Sözleşme", "Fatura", "Teklif", "İrsaliye", "Garanti", "Police", "Ruhsat", "Teknik Doküman", "Fotoğraf", "Tutanak"];

const demoDocs = Array.from({ length: 15 }).map((_, i) => ({
  key: i + 1,
  id: String(i + 1),
  fileName: `belge_ekibi_${i + 1}.pdf`,
  module: i % 2 === 0 ? "Bakım" : "Satınalma",
  entityType: i % 2 === 0 ? "İş Emri" : "Sipariş",
  entityNo: `IE-2026-${100 + i}`,
  docType: DOC_TYPES[i % DOC_TYPES.length],
  description: "Modül bazlı yüklenen teknik doküman ve ekleri.",
  status: Object.keys(STATUS_MAP)[i % 5],
  uploadedBy: "Nur A.",
  uploadedAt: "2026-02-01",
  size: "1.2 MB",
  version: "v1",
  renewalAt: "2026-05-15",
}));

export default function DocumentHubAntD() {
  const [data, setData] = useState(demoDocs);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);

  // Toplu İşlem Menüsü
  const bulkMenu = {
    items: [
      { key: 'download', label: 'Seçilenleri İndir', icon: <DownloadOutlined /> },
      { key: 'archive', label: 'Arşivle', icon: <HistoryOutlined /> },
      { key: 'delete', label: 'Sil', icon: <DeleteOutlined />, danger: true },
    ],
    onClick: ({ key }) => {
      if (selectedRowKeys.length === 0) return message.warning("Önce belge seçmelisiniz.");
      if (key === 'delete') {
        setData(prev => prev.filter(item => !selectedRowKeys.includes(item.key)));
        setSelectedRowKeys([]);
        message.success(`${selectedRowKeys.length} dosya silindi.`);
      } else {
        message.info(`Toplu işlem: ${key} tetiklendi.`);
      }
    }
  };

  const columns = [
    {
      title: "Dosya",
      dataIndex: "fileName",
      key: "fileName",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <FilePdfOutlined style={{ color: '#ff4d4f' }} />
            <Text strong className="text-blue-600 cursor-pointer hover:underline" onClick={() => message.info("Dosya açılıyor...")}>
              {text}
            </Text>
          </Space>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.docType} · {record.size} · {record.version}
          </Text>
        </Space>
      ),
    },
    {
      title: "Modül",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Bağlı Kayıt",
      key: "entity",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>{record.entityType}</Text>
          <Button type="link" size="small" style={{ padding: 0, height: 'auto' }} icon={<LinkOutlined />}>
            {record.entityNo}
          </Button>
        </Space>
      ),
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space direction="vertical" size={0}>
          <Badge color={STATUS_MAP[status].color} text={STATUS_MAP[status].label} />
          <Text type="secondary" style={{ fontSize: 11 }}>Yenileme: {record.renewalAt}</Text>
        </Space>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text>
    },
    {
      title: "Yükleyen",
      key: "uploader",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>{record.uploadedBy}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.uploadedAt}</Text>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter(item => 
    item.fileName.toLowerCase().includes(searchText.toLowerCase()) || 
    item.entityNo.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 16, background: "#f5f7f9", minHeight: "100vh" }}>
      <Card bordered={false} bodyStyle={{ padding: "12px 24px" }} style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space size="middle">
            <Input
              placeholder="Dosya adı, kayıt no ara..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              style={{ width: 300, borderRadius: 8 }}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>Filtreler</Button>
            <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadVisible(true)}>
              Doküman Yükle
            </Button>
          </Space>

          <Space>
            {selectedRowKeys.length > 0 && <Text type="secondary">{selectedRowKeys.length} seçili</Text>}
            <Dropdown menu={bulkMenu}>
              <Button icon={<EllipsisOutlined />}>Toplu İşlemler</Button>
            </Dropdown>
          </Space>
        </div>

        <Table
  rowSelection={{
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }}
  columns={columns}
  dataSource={filteredData}
  pagination={{ 
    pageSize: 10,
    size: "small",
    showSizeChanger: true 
  }}
  size="middle"
  // Scroll eklenen kısım burası kanka:
  scroll={{ 
    x: 1200, // Tablo kolonları toplam genişliği (Yatay kaydırma için)
    y: "calc(100vh - 320px)" // Ekran yüksekliğine göre dikey kaydırma (Dikey kaydırma için)
  }}
  // Header'ın sabit kalmasını sağlar
  sticky
/>
      </Card>

      {/* FİLTRE DRAWER */}
      <Drawer
        title="Gelişmiş Filtreler"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        width={380}
        extra={
          <Space>
            <Button onClick={() => setFilterOpen(false)}>Sıfırla</Button>
            <Button type="primary" onClick={() => setFilterOpen(false)}>Uygula</Button>
          </Space>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>Doküman Tipi</Text>
            <Select style={{ width: '100%', marginTop: 8 }} placeholder="Seçiniz">
              {DOC_TYPES.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
            </Select>
          </div>
          <div>
            <Text strong>Durum</Text>
            <Select style={{ width: '100%', marginTop: 8 }} placeholder="Seçiniz">
              {Object.entries(STATUS_MAP).map(([key, val]) => <Select.Option key={key} value={key}>{val.label}</Select.Option>)}
            </Select>
          </div>
          <Checkbox>Sadece benim yüklediklerim</Checkbox>
          <Checkbox>30 gün içinde süresi dolacaklar</Checkbox>
        </Space>
      </Drawer>

      {/* YÜKLEME MODAL */}
      <Modal
        title="Yeni Doküman Yükle"
        open={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        onOk={() => {
            message.success("Dosyalar başarıyla eklendi.");
            setUploadVisible(false);
        }}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Dragger>
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">Dosyaları buraya sürükleyin veya tıklayın</p>
            <p className="ant-upload-hint">PDF, Excel veya Görsel dosyaları yükleyebilirsiniz.</p>
          </Dragger>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
             <div>
                <Text size="small" type="secondary">Modül</Text>
                <Select style={{ width: '100%' }} defaultValue="Bakım">
                    <Select.Option value="Bakım">Bakım</Select.Option>
                    <Select.Option value="Satınalma">Satınalma</Select.Option>
                </Select>
             </div>
             <div>
                <Text size="small" type="secondary">Kayıt No</Text>
                <Input placeholder="IE-2026-001" />
             </div>
          </div>

          <div>
             <Text size="small" type="secondary">Doküman Tipi</Text>
             <Select style={{ width: '100%' }} placeholder="Seçiniz">
                {DOC_TYPES.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
             </Select>
          </div>

          <div>
             <Text size="small" type="secondary">Açıklama</Text>
             <Input.TextArea rows={3} placeholder="Not ekleyin..." />
          </div>
        </Space>
      </Modal>
    </div>
  );
}