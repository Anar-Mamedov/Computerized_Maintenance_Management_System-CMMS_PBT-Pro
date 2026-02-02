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
  const [view, setView] = useState("LIST"); // LIST | WIZARD
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(demoTransfers);
  const [searchText, setSearchText] = useState("");
  const [isTransitModalOpen, setIsTransitModalOpen] = useState(false);

  // Liste Görünümü Kolonları
  const columns = [
    {
      title: "Transfer No",
      dataIndex: "no",
      key: "no",
      render: (text) => <Text strong className="text-blue-600 cursor-pointer">{text}</Text>,
    },
    {
      title: "Planlanan Tarih",
      dataIndex: "plannedDate",
      key: "plannedDate",
    },
    {
      title: "Güzergah",
      key: "route",
      render: (_, r) => (
        <Space>
          <Text>{r.sourceSite}</Text>
          <ArrowRightOutlined style={{ fontSize: 12, color: "#bfbfbf" }} />
          <Text>{r.targetSite}</Text>
        </Space>
      ),
    },
    {
      title: "Ekipman",
      dataIndex: "equipmentCount",
      key: "equipmentCount",
      align: "center",
      render: (count) => <Badge count={count} color="#108ee9" />,
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (st) => (
        <Tag color={STATUS_CONFIG[st].color}>
          {STATUS_CONFIG[st].label}
        </Tag>
      ),
    },
    {
      title: "İşlem",
      key: "action",
      align: "right",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "approve", label: "Onayla", icon: <CheckCircleOutlined /> },
              { key: "transit", label: "Sevkiyata Çıkar", icon: <TruckOutlined />, onClick: () => setIsTransitModalOpen(true) },
              { key: "receive", label: "Teslim Al", icon: <InboxOutlined /> },
              { type: "divider" },
              { key: "cancel", label: "İptal Et", danger: true },
            ],
          }}
        >
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Filtrelenmiş veri
  const filteredData = data.filter(item => 
    item.no.toLowerCase().includes(searchText.toLowerCase()) ||
    item.sourceSite.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {view === "LIST" ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
              <div>
                <Title level={3} style={{ margin: 0 }}>Ekipman Transferleri</Title>
                <Text type="secondary">Şantiyeler arası makine ve ekipman hareketleri</Text>
              </div>
              <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setView("WIZARD")}>
                Yeni Transfer Talebi
              </Button>
            </div>

            <Card bordered={false} style={{ borderRadius: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <Input
                  placeholder="Transfer no, şantiye veya personel ara..."
                  prefix={<SearchOutlined />}
                  style={{ width: 400, borderRadius: 8 }}
                  onChange={e => setSearchText(e.target.value)}
                />
              </div>
              <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 10 }}
                scroll={{ y: "calc(100vh - 400px)" }}
                sticky
              />
            </Card>
          </>
        ) : (
          /* WIZARD VIEW (YENİ TRANSFER) */
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Button type="link" onClick={() => { setView("LIST"); setCurrentStep(0); }} style={{ padding: 0, marginBottom: 20 }}>
              ← Listeye Geri Dön
            </Button>
            
            <Steps
              current={currentStep}
              style={{ marginBottom: 40 }}
              items={[
                { title: "Genel Bilgiler", icon: <InfoCircleOutlined /> },
                { title: "Ekipman Seçimi", icon: <SwapOutlined /> },
                { title: "Özet ve Onay", icon: <CheckCircleOutlined /> },
              ]}
            />

            {currentStep === 0 && (
              <Form layout="vertical" style={{ maxWidth: 600, margin: "0 auto" }}>
                <Row gutter={16}>
                  <Col span={11}>
                    <Form.Item label="Kaynak Şantiye" required>
                      <Select placeholder="Seçiniz">
                        {SITES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
                    <ArrowRightOutlined />
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Hedef Şantiye" required>
                      <Select placeholder="Seçiniz">
                        {SITES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Planlanan Transfer Tarihi" required>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Transfer Nedeni">
                  <Input.TextArea rows={3} placeholder="Neden transfer yapılıyor?" />
                </Form.Item>
                <Button type="primary" block size="large" onClick={() => setCurrentStep(1)}>
                  Devam Et: Ekipman Seçimi
                </Button>
              </Form>
            )}

            {currentStep === 1 && (
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Bu aşamada kaynak şantiyedeki uygun ekipmanlar listelenir.</Text>
                <Divider />
                <Space>
                  <Button onClick={() => setCurrentStep(0)}>Geri</Button>
                  <Button type="primary" onClick={() => setCurrentStep(2)}>Seçimi Tamamla</Button>
                </Space>
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ textAlign: 'center' }}>
                <Badge.Ribbon text="Özet" color="blue">
                  <Card title="Transfer Detayları" style={{ width: 500, margin: '0 auto' }}>
                    <Text>Onaya gönderildiğinde ilgili birimlere bildirim gidecektir.</Text>
                  </Card>
                </Badge.Ribbon>
                <Divider />
                <Space>
                  <Button onClick={() => setCurrentStep(1)}>Geri</Button>
                  <Button type="primary" size="large" onClick={() => { message.success("Talep başarıyla oluşturuldu."); setView("LIST"); setCurrentStep(0); }}>
                    Onaya Gönder
                  </Button>
                </Space>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* SEVKİYAT MODALI */}
      <Modal
        title="Sevkiyata Çıkar"
        open={isTransitModalOpen}
        onCancel={() => setIsTransitModalOpen(false)}
        onOk={() => { message.success("Sevkiyat başlatıldı."); setIsTransitModalOpen(false); }}
        okText="Sevkiyatı Başlat"
      >
        <Form layout="vertical">
          <Form.Item label="Çıkış Tarihi / Saati">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Taşıyıcı Firma">
                <Input placeholder="Örn: Aras Lojistik" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Araç Plakası">
                <Input placeholder="34 ABC 123" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Sürücü Bilgisi">
            <Input placeholder="Ad Soyad / Telefon" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}