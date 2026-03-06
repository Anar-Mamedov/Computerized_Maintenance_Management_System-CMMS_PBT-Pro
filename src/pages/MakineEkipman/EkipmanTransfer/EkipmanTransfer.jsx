import React, { useState } from "react";
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
  Dropdown,
  Divider,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ArrowRightOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  DownloadOutlined
} from "@ant-design/icons";

const { Text, Title } = Typography;

// -------------------- Mock Data & Config --------------------
const SITES = ["Şantiye A", "Şantiye B", "Şantiye C", "Merkez Depo"];

const STATUS_CONFIG = {
  PENDING_APPROVAL: { color: "warning", label: "Onay Bekliyor" },
  APPROVED: { color: "processing", label: "Onaylandı" },
  IN_TRANSIT: { color: "blue", label: "Sevkiyatta" },
  COMPLETED: { color: "success", label: "Tamamlandı" },
  DRAFT: { color: "default", label: "Taslak" },
};

const demoTransfers = [
  { key: "1", id: "t1", no: "TRF-2026-000128", plannedDate: "2026-01-07", sourceSite: "Şantiye A", targetSite: "Şantiye B", equipmentCount: 3, status: "PENDING_APPROVAL" },
  { key: "2", id: "t2", no: "TRF-2026-000127", plannedDate: "2026-01-06", sourceSite: "Şantiye B", targetSite: "Merkez Depo", equipmentCount: 5, status: "APPROVED" },
];

export default function AntDTransferManagement() {
  const [view, setView] = useState("LIST");
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();

  const showDetails = (record) => {
    setSelectedTransfer(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
  title: "Transfer No",
  dataIndex: "no",
  key: "no",
  fixed: 'left',
  width: 160,
  render: (text, record) => (
    <Text 
      strong 
      style={{ color: '#1890ff', cursor: 'pointer' }} 
      onClick={() => showDetails(record)}
    >
      {text}
    </Text>
  ),
},
    {
      title: "Tarih",
      dataIndex: "plannedDate",
      key: "plannedDate",
      width: 120,
    },
    {
      title: "Güzergah",
      key: "route",
      minWidth: 250,
      flex: 1, // Esnek genişlik
      render: (_, r) => (
        <Space split={<ArrowRightOutlined style={{ color: "#bfbfbf", fontSize: 12 }} />}>
          <Tag color="default">{r.sourceSite}</Tag>
          <Tag color="blue">{r.targetSite}</Tag>
        </Space>
      ),
    },
    {
      title: "Adet",
      dataIndex: "equipmentCount",
      key: "equipmentCount",
      align: "center",
      width: 80,
      render: (count) => <Badge count={count} showZero color="#108ee9" />,
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (st) => (
        <Tag color={STATUS_CONFIG[st].color} style={{ borderRadius: 12 }}>
          {STATUS_CONFIG[st].label}
        </Tag>
      ),
    },
    {
      title: "İşlem",
      key: "action",
      align: "right",
      fixed: 'right', // İşlemler her zaman sağda kalsın
      width: 70,
      render: () => (
        <Dropdown menu={{ items: [{ key: "1", label: "Detay", icon: <InfoCircleOutlined /> }] }}>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ 
      background: "#ffffff", // Arka plan tamamen beyaz
      minHeight: "100vh",
      padding: "24px 0" // Sağ-sol padding'i iç konteynere bırakıyoruz
    }}>
      <div style={{ width: '95%', margin: "0 auto" }}>
        
        {view === "LIST" ? (
          <>
            {/* Header */}
            <Row justify="space-between" align="bottom" style={{ marginBottom: 32 }}>
              <Col xs={24} md={16}>
                <Title level={2} style={{ margin: 0 }}>Ekipman Transferleri</Title>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
                <Button 
  type="primary" 
  icon={<PlusOutlined />} 
  size="large" 
  onClick={() => setIsAddModalOpen(true)} // Modal'ı açar
>
  Ekle
</Button>
              </Col>
            </Row>

            {/* Filtre Alanı */}
            <Card variant="borderless" style={{ marginBottom: 16, border: '1px solid #f0f0f0' }}>
               <Row gutter={[16, 16]} align="middle">
                 <Col xs={24} lg={12}>
                    <Input
                      placeholder="Hızlı arama..."
                      prefix={<SearchOutlined />}
                      size="large"
                      style={{ borderRadius: 8 }}
                    />
                 </Col>
                 <Col xs={24} lg={12} style={{ textAlign: 'right' }}>
                    <Space>
                      <Button icon={<FilterOutlined />}>Filtrele</Button>
                      <Button icon={<DownloadOutlined />}>Dışa Aktar</Button>
                    </Space>
                 </Col>
               </Row>
            </Card>

            {/* Dinamik Tablo - x: 'max-content' her ekrana sığmasını sağlar */}
            <Table
              columns={columns}
              dataSource={demoTransfers}
              scroll={{ x: 'max-content' }} 
              pagination={{ responsive: true, pageSize: 10 }}
              style={{ border: '1px solid #f0f0f0', borderRadius: 8 }}
            />
          </>
        ) : (
          /* Transfer Sihirbazı */
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Button type="link" onClick={() => setView("LIST")} style={{ marginBottom: 16 }}>
              ← Listeye Dön
            </Button>
            <Card title="Yeni Transfer Talebi Oluştur" bordered={false} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Steps current={currentStep} items={[{ title: "Konum" }, { title: "Ekipman" }, { title: "Onay" }]} style={{ marginBottom: 40 }} />
              
              <Form layout="vertical">
                <Row gutter={24}>
                  <Col xs={24} md={11}><Form.Item label="Kaynak"><Select options={SITES.map(s => ({label:s, value:s}))} /></Form.Item></Col>
                  <Col xs={24} md={2} style={{ textAlign: 'center', alignSelf: 'center' }}><ArrowRightOutlined /></Col>
                  <Col xs={24} md={11}><Form.Item label="Hedef"><Select options={SITES.map(s => ({label:s, value:s}))} /></Form.Item></Col>
                </Row>
                <Form.Item label="Planlanan Tarih"><DatePicker style={{ width: '100%' }} /></Form.Item>
                <Divider />
                <Button type="primary" size="large" block onClick={() => setCurrentStep(1)}>Devam Et</Button>
              </Form>
            </Card>
          </div>
        )}
      </div>
      <Modal
  title="Transfer Fişi"
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={[
    <Button key="close" onClick={() => setIsModalOpen(false)}>Kapat</Button>
  ]}
  width={800}
>
  {selectedTransfer && (
    <>
      <Row justify="space-between" align="middle">
        <Col>
          <Text type="secondary">Transfer No</Text>
          <Title level={4} style={{ margin: 0 }}>{selectedTransfer.no}</Title>
          <Text type="secondary">
            {selectedTransfer.sourceSite} → {selectedTransfer.targetSite} • Planlanan: {selectedTransfer.plannedDate}
          </Text>
        </Col>
        <Col>
          <Tag color={STATUS_CONFIG[selectedTransfer.status].color} style={{ borderRadius: 12 }}>
            {STATUS_CONFIG[selectedTransfer.status].label}
          </Tag>
        </Col>
      </Row>

      <Table
        style={{ marginTop: 20 }}
        pagination={false}
        dataSource={[
          { key: '1', code: 'EXC-001', type: 'Ekskavatör', status: 'Aktif', site: 'Şantiye A' },
          { key: '2', code: 'DZR-003', type: 'Dozer', status: 'Aktif', site: 'Şantiye A' },
          { key: '3', code: 'CMP-021', type: 'Kompaktör', status: 'Transferde', site: 'Şantiye A' },
        ]}
        columns={[
          { title: 'Kod', dataIndex: 'code', key: 'code' },
          { title: 'Tip', dataIndex: 'type', key: 'type' },
          { title: 'Durum', dataIndex: 'status', key: 'status' },
          { title: 'Mevcut Şantiye', dataIndex: 'site', key: 'site' },
          { title: 'Teslim', dataIndex: 'delivery', key: 'delivery', render: () => '—' },
        ]}
      />
      
      <Text type="secondary" style={{ fontSize: '12px', marginTop: 16, display: 'block' }}>
        İpucu: Listede Transfer No üzerine tıklayarak fiş içindeki ekipmanları burada görebilirsiniz.
      </Text>
    </>
  )}
</Modal>
<Modal
  title="Yeni Transfer Talebi Oluştur"
  open={isAddModalOpen}
  onCancel={() => {
    setIsAddModalOpen(false);
    setCurrentStep(0); // Kapatıldığında adımı sıfırla
    addForm.resetFields();
  }}
  footer={null} // Kendi butonlarımızı form içinde kullanacağız
  width={700}
>
  <Steps 
    current={currentStep} 
    size="small"
    items={[{ title: "Konum" }, { title: "Ekipman" }, { title: "Onay" }]} 
    style={{ marginBottom: 32, marginTop: 16 }} 
  />
  
  <Form 
    form={addForm}
    layout="vertical"
  >
    {currentStep === 0 && (
  <>
    <Row gutter={24} align="middle">
      <Col span={11}>
        <Form.Item name="source" label="Kaynak Şantiye" rules={[{ required: true, message: 'Lütfen kaynak seçin' }]}>
          <Select placeholder="Seçiniz" options={SITES.map(s => ({ label: s, value: s }))} />
        </Form.Item>
      </Col>
      <Col span={2} style={{ textAlign: 'center', marginTop: 8 }}>
        <ArrowRightOutlined style={{ color: '#bfbfbf' }} />
      </Col>
      <Col span={11}>
        <Form.Item name="target" label="Hedef Şantiye" rules={[{ required: true, message: 'Lütfen hedef seçin' }]}>
          <Select placeholder="Seçiniz" options={SITES.map(s => ({ label: s, value: s }))} />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={24}>
      <Col span={12}>
        <Form.Item name="date" label="Planlanan Transfer Tarihi" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="reason" label="Transfer Nedeni" rules={[{ required: true, message: 'Lütfen bir neden seçin' }]}>
          <Select placeholder="Neden Seçiniz">
            <Select.Option value="arıza">Arıza / Bakım</Select.Option>
            <Select.Option value="proje_bitiş">Proje Tamamlanması</Select.Option>
            <Select.Option value="ihtiyaç">Operasyonel İhtiyaç</Select.Option>
            <Select.Option value="yedek">Yedekleme</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>

    <Form.Item name="description" label="Açıklama">
      <Input.TextArea 
        rows={3} 
        placeholder="Transferle ilgili eklemek istediğiniz notlar..." 
        maxLength={200}
        showCount
      />
    </Form.Item>
    
    <Divider />
    <div style={{ textAlign: 'right' }}>
      <Button type="primary" size="large" onClick={() => setCurrentStep(1)}>
        Devam Et
      </Button>
    </div>
  </>
)}

    {currentStep === 1 && (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Text type="secondary">Ekipman seçim ekranı buraya gelecek...</Text>
        <Divider />
        <Space>
          <Button onClick={() => setCurrentStep(0)}>Geri</Button>
          <Button type="primary" onClick={() => setCurrentStep(2)}>Devam Et</Button>
        </Space>
      </div>
    )}

    {currentStep === 2 && (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Text strong>Transfer talebi onaylanmaya hazır.</Text>
        <Divider />
        <Space>
          <Button onClick={() => setCurrentStep(1)}>Geri</Button>
          <Button type="primary" onClick={() => setIsAddModalOpen(false)}>Tamamla ve Gönder</Button>
        </Space>
      </div>
    )}
  </Form>
</Modal>
    </div>
  );
}