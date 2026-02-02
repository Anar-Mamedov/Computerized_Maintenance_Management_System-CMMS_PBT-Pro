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
  Card,
  Typography,
  Steps,
  Row,
  Col,
  DatePicker,
  Form,
  Checkbox,
  Dropdown,
  message,
  Divider,
} from "antd";
import {
  SwapOutlined,
  PlusOutlined,
  SearchOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  InboxOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  DownloadOutlined
} from "@ant-design/icons";

const { Text, Title } = Typography;

// -------------------- Mock Data --------------------
const SITES = ["Şantiye A", "Şantiye B", "Şantiye C", "Merkez Depo"];

const STATUS_CONFIG = {
  PENDING_APPROVAL: { color: "warning", label: "Onay Bekliyor" },
  APPROVED: { color: "processing", label: "Onaylandı" },
  IN_TRANSIT: { color: "blue", label: "Sevkiyatta" },
  COMPLETED: { color: "success", label: "Tamamlandı" },
  DRAFT: { color: "default", label: "Taslak" },
};

const demoTransfers = [
  {
    key: "1",
    id: "t1",
    no: "TRF-2026-000128",
    plannedDate: "2026-01-07",
    sourceSite: "Şantiye A",
    targetSite: "Şantiye B",
    equipmentCount: 3,
    status: "PENDING_APPROVAL",
    requester: "Erhan Çevik",
  },
  {
    key: "2",
    id: "t2",
    no: "TRF-2026-000127",
    plannedDate: "2026-01-06",
    sourceSite: "Şantiye B",
    targetSite: "Merkez Depo",
    equipmentCount: 5,
    status: "APPROVED",
    requester: "Ahmet Y.",
  }
];

export default function AntDTransferManagement() {
  const [view, setView] = useState("LIST");
  const [currentStep, setCurrentStep] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isTransitModalOpen, setIsTransitModalOpen] = useState(false);

  // Kolon genişliklerini dinamik yönetmek için "width" değerleri ekledik
  const columns = [
    {
      title: "Transfer No",
      dataIndex: "no",
      key: "no",
      width: 180,
      render: (text) => <Text strong style={{ color: '#1890ff', cursor: 'pointer' }}>{text}</Text>,
    },
    {
      title: "Planlanan Tarih",
      dataIndex: "plannedDate",
      key: "plannedDate",
      width: 150,
    },
    {
      title: "Güzergah",
      key: "route",
      minWidth: 180,
      render: (_, r) => (
        <Space split={<ArrowRightOutlined style={{ color: "#bfbfbf", fontSize: 12 }} />}>
          <Tag color="default" style={{ borderRadius: 4 }}>{r.sourceSite}</Tag>
          <Tag color="blue" style={{ borderRadius: 4 }}>{r.targetSite}</Tag>
        </Space>
      ),
    },
    {
      title: "Ekipman",
      dataIndex: "equipmentCount",
      key: "equipmentCount",
      align: "center",
      width: 100,
      render: (count) => <Badge count={count} overflowCount={99} style={{ backgroundColor: '#108ee9' }} />,
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (st) => (
        <Tag color={STATUS_CONFIG[st].color} style={{ borderRadius: 12, paddingInline: 12 }}>
          {STATUS_CONFIG[st].label}
        </Tag>
      ),
    },
    {
      title: "İşlem",
      key: "action",
      align: "right",
      width: 80,
      render: () => (
        <Dropdown menu={{ items: [
          { key: "1", label: "Detaylar", icon: <InfoCircleOutlined /> },
          { key: "2", label: "Düzenle", icon: <PlusOutlined /> },
          { key: "3", label: "İptal", danger: true }
        ] }}>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ 
      padding: "min(2vw, 24px)", // Dinamik padding: Ekran küçüldükçe azalır
      background: "#f0f2f5", 
      minHeight: "100vh" 
    }}>
      {/* Ana konteyner dev ekranlarda çok yayılmasın diye limitlendi */}
      <div style={{ maxWidth: 1600, margin: "0 auto", width: '100%' }}>
        
        {view === "LIST" ? (
          <>
            {/* Dinamik Header */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-end", 
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 16
            }}>
              <div>
                <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 2.5vw, 28px)' }}>Ekipman Transferleri</Title>
                <Text type="secondary">Şantiyeler arası makine ve ekipman lojistik yönetimi</Text>
              </div>
              <Button type="primary" icon={<PlusOutlined />} size="large" shape="round" onClick={() => setView("WIZARD")}>
                Yeni Transfer Talebi
              </Button>
            </div>

            {/* Filtre ve Tablo Kartı */}
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ 
                marginBottom: 20, 
                display: 'flex', 
                gap: 12, 
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}>
                <Input
                  placeholder="Transfer no veya şantiye ara..."
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  style={{ width: 'clamp(250px, 30vw, 450px)', borderRadius: 8 }}
                  onChange={e => setSearchText(e.target.value)}
                />
                <Space>
                   <Button icon={<FilterOutlined />}>Gelişmiş Filtre</Button>
                   <Button icon={<DownloadOutlined />}>Excel</Button>
                </Space>
              </div>

              <Table
                columns={columns}
                dataSource={demoTransfers}
                pagination={{ 
                  pageSize: 12, 
                  showSizeChanger: true,
                  size: window.innerWidth < 1200 ? "small" : "default" 
                }}
                // En kritik kısım: Büyük ekranda tam sığar, küçükte yatay scroll çıkar
                scroll={{ x: 1000, y: 'calc(100vh - 400px)' }}
                sticky
                size="middle"
              />
            </Card>
          </>
        ) : (
          /* SİHİRBAZ GÖRÜNÜMÜ - Responsive Form */
          <Card bordered={false} style={{ borderRadius: 16, minHeight: '60vh' }}>
            <Button type="link" onClick={() => { setView("LIST"); setCurrentStep(0); }} style={{ padding: 0, marginBottom: 24 }}>
              ← Transfer Listesine Dön
            </Button>
            
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Steps
                current={currentStep}
                style={{ marginBottom: 48 }}
                items={[
                  { title: "Genel Bilgiler" },
                  { title: "Ekipman Seçimi" },
                  { title: "Onay" },
                ]}
              />

              <div style={{ background: '#fafafa', padding: 'min(5vw, 40px)', borderRadius: 12 }}>
                {currentStep === 0 && (
                  <Form layout="vertical">
                    <Row gutter={24}>
                      <Col xs={24} md={11}>
                        <Form.Item label="Kaynak Şantiye" required>
                          <Select placeholder="Nereden?" size="large" options={SITES.map(s => ({ label: s, value: s }))} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: 10 }}>
                        <ArrowRightOutlined style={{ transform: window.innerWidth < 768 ? 'rotate(90deg)' : 'none' }} />
                      </Col>
                      <Col xs={24} md={11}>
                        <Form.Item label="Hedef Şantiye" required>
                          <Select placeholder="Nereye?" size="large" options={SITES.map(s => ({ label: s, value: s }))} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item label="Transfer Tarihi" required>
                      <DatePicker style={{ width: '100%' }} size="large" />
                    </Form.Item>
                    <Divider />
                    <Button type="primary" block size="large" onClick={() => setCurrentStep(1)}>
                      Sonraki Adım: Ekipmanları Seç
                    </Button>
                  </Form>
                )}
                {/* Diğer step'ler buraya gelecek */}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* MODAL - Dinamik Genişlik */}
      <Modal
        title="Sevkiyat Detayları"
        open={isTransitModalOpen}
        onCancel={() => setIsTransitModalOpen(false)}
        width={window.innerWidth < 768 ? '95%' : 600}
        centered
      >
        <Form layout="vertical">
          {/* ... Modal içeriği aynı ... */}
        </Form>
      </Modal>
    </div>
  );
}