import React, { useMemo, useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Progress,
  Drawer,
  Space,
  Card,
  Statistic,
  Row,
  Col,
  InputNumber,
  Typography,
  message,
  Divider,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  PlusOutlined,
  HistoryOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

// ================== MOCK DATA ==================
const PROJECTS = [
  { id: "PRJ-2026-001", name: "Bursa Lojistik Merkez İnşaatı", client: "ACME Logistics" },
  { id: "PRJ-2026-002", name: "Ankara Şantiye Altyapı İyileştirme", client: "Kamu Kurumu" },
];

const INITIAL_WBS = [
  {
    id: "1",
    key: "1",
    code: "1",
    name: "Mobilizasyon",
    unit: "ls",
    planned: 1,
    actual: 0.6,
    children: [
      { id: "1.1", key: "1.1", code: "1.1", name: "Şantiye Kurulumu", unit: "ls", planned: 1, actual: 0.8 },
      { id: "1.2", key: "1.2", code: "1.2", name: "Geçici Tesisler", unit: "ls", planned: 1, actual: 0.4 },
    ],
  },
  {
    id: "2",
    key: "2",
    code: "2",
    name: "Hafriyat İşleri",
    unit: "m3",
    planned: 10000,
    actual: 6500,
    children: [
      { id: "2.1", key: "2.1", code: "2.1", name: "Kazı", unit: "m3", planned: 7000, actual: 5200 },
      { id: "2.2", key: "2.2", code: "2.2", name: "Dolgu", unit: "m3", planned: 3000, actual: 1300 },
    ],
  },
];

export default function AntDWBSProgress() {
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [wbsData, setWbsData] = useState(INITIAL_WBS);
  const [selectedNode, setSelectedNode] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Durum Belirleyici
  const getStatus = (pct) => {
    if (pct >= 100) return <Tag color="success">Tamam</Tag>;
    if (pct >= 75) return <Tag color="blue">Normal</Tag>;
    if (pct >= 40) return <Tag color="warning">Risk</Tag>;
    return <Tag color="error">Gecikmiş</Tag>;
  };

  // Tablo Kolonları
  const columns = [
    {
      title: "WBS / İş Kalemi",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          {record.children ? <FolderOpenOutlined style={{ color: "#1890ff" }} /> : <FileTextOutlined />}
          <Text strong={!!record.children}>{record.code} - {text}</Text>
        </Space>
      ),
    },
    { title: "Birim", dataIndex: "unit", key: "unit", width: 80, align: "center" },
    { title: "Planlanan", dataIndex: "planned", key: "planned", align: "right" },
    { title: "Gerçekleşen", dataIndex: "actual", key: "actual", align: "right" },
    {
      title: "İlerleme",
      key: "progress",
      width: 250,
      render: (_, r) => {
        const pct = Math.round((r.actual / r.planned) * 100) || 0;
        return (
          <Space direction="vertical" style={{ width: "100%" }} size={0}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <Text style={{ fontSize: 11 }}>{pct}%</Text>
              {getStatus(pct)}
            </div>
            <Progress percent={pct} size="small" strokeColor={pct >= 100 ? "#52c41a" : "#1890ff"} />
          </Space>
        );
      },
    },
    {
      title: "İşlem",
      key: "action",
      width: 100,
      align: "center",
      render: (_, r) => !r.children && (
        <Button 
          type="primary" 
          ghost 
          size="small" 
          icon={<PlusOutlined />} 
          onClick={() => { setSelectedNode(r); setDrawerOpen(true); }}
        >
          Giriş
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f7f9", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        
        {/* Proje Bilgi Kartı */}
        <Card bordered={false} style={{ borderRadius: 16, marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text type="secondary">AKTİF PROJE</Text>
              <Title level={4} style={{ margin: 0 }}>
                {PROJECTS.find(p => p.id === projectId)?.name}
              </Title>
              <Text size="small" type="secondary">Kodu: {projectId} • Müşteri: {PROJECTS.find(p => p.id === projectId)?.client}</Text>
            </Col>
            <Col>
              <Select 
                value={projectId} 
                onChange={setProjectId} 
                style={{ width: 300 }}
                options={PROJECTS.map(p => ({ label: p.name, value: p.id }))}
              />
            </Col>
          </Row>
        </Card>

        {/* KPI Paneli */}
        
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #52c41a' }}>
              <Statistic title="Genel Fiziksel İlerleme" value={48.2} suffix="%" />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #1890ff' }}>
              <Statistic title="Planlanan İlerleme" value={55} suffix="%" />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #ff4d4f' }}>
              <Statistic title="Sapma" value={-6.8} suffix="%" valueStyle={{ color: '#cf1322' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #faad14' }}>
              <Statistic title="İş Kalemi Sayısı" value={142} />
            </Card>
          </Col>
        </Row>

        {/* Filtre ve Tablo */}
        <Card bordered={false} style={{ borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Input 
              placeholder="WBS Kodu veya İş Kalemi ara..." 
              prefix={<SearchOutlined />} 
              style={{ width: 350 }}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button icon={<DownloadOutlined />}>Excel Export</Button>
          </div>

          <Table 
            columns={columns} 
            dataSource={wbsData} 
            pagination={false}
            scroll={{ y: 'calc(75vh - 420px)' }}
            sticky
            expandable={{ defaultExpandAllRows: true }}
          />
        </Card>
      </div>

      {/* İlerleme Giriş Drawer'ı */}
      <Drawer
        title={selectedNode ? `${selectedNode.code} - ${selectedNode.name}` : "Detay"}
        width={600}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        extra={
          <Button type="primary" onClick={() => { message.success("İlerleme kaydedildi."); setDrawerOpen(false); }}>
            Kaydet
          </Button>
        }
      >
        {selectedNode && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="Mevcut Durum">
                  <Statistic title="Gerçekleşen" value={selectedNode.actual} suffix={selectedNode.unit} />
                  <Progress percent={Math.round((selectedNode.actual / selectedNode.planned) * 100)} />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Yeni Giriş">
                  <Text size="small">Artış Miktarı ({selectedNode.unit})</Text>
                  <InputNumber style={{ width: '100%', marginTop: 8 }} placeholder="0.00" />
                </Card>
              </Col>
            </Row>

            <Divider orientation="left"><HistoryOutlined /> Giriş Geçmişi</Divider>

            <Table 
              size="small"
              pagination={false}
              dataSource={[
                { key: '1', date: '01.02.2026', amount: 0.2, note: 'Saha teslimi yapıldı.' },
                { key: '2', date: '30.01.2026', amount: 0.4, note: 'Ekipman mobilizasyonu.' },
              ]}
              columns={[
                { title: 'Tarih', dataIndex: 'date', key: 'date' },
                { title: 'Miktar', dataIndex: 'amount', key: 'amount', align: 'right' },
                { title: 'Not', dataIndex: 'note', key: 'note', ellipsis: true },
                { 
                  title: 'İşlem', 
                  key: 'op', 
                  render: () => (
                    <Space>
                      <Button type="text" size="small" icon={<EditOutlined />} />
                      <Popconfirm title="Silmek istediğinize emin misiniz?">
                        <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  ) 
                },
              ]}
            />
          </Space>
        )}
      </Drawer>
    </div>
  );
}