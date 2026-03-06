import React, { useMemo, useState } from "react";
import { 
  Layout, Typography, Space, Avatar, Button, Input, Card, Tag, Progress, 
  Badge, Row, Col, Form, DatePicker, Select, Tabs, Table, Upload, List, message, Divider, InputNumber 
} from "antd";
import {
  SaveOutlined, CloseOutlined, PlusOutlined, LinkOutlined, FileTextOutlined, 
  PictureOutlined, UserOutlined, ToolOutlined, ApartmentOutlined, DollarOutlined, 
  SearchOutlined, HistoryOutlined, CalendarOutlined, AlertOutlined, TagOutlined
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// --- Helper Functions ---
function pct(n) { return Math.max(0, Math.min(100, n)); }

function flattenTree(nodes, level = 0) {
  const out = [];
  for (const n of nodes) {
    out.push({ ...n, level });
    if (n.children?.length) out.push(...flattenTree(n.children, level + 1));
  }
  return out;
}

export default function AntDProjectDefinitions({ projectData, onClose }) {
  const [form] = Form.useForm();
  
  // 1. KPI Verileri (Mock tasarımdaki gibi 6'lı yapı)
  const completion = projectData?.fizikselYuzde || 0;
  const kpis = [
    { title: "Tamamlanma", value: `${completion}%`, icon: <ApartmentOutlined /> },
    { title: "Planlanan Süre", value: "24 ay", icon: <CalendarOutlined /> },
    { title: "Makine Saatleri", value: "1.248", icon: <ToolOutlined /> },
    { title: "Personel Saatleri", value: "4.920", icon: <UserOutlined /> },
    { title: "Aktif Makine", value: projectData?.kaynaklar?.makine || "18", icon: <ToolOutlined /> },
    { title: "Aktif Personel", value: projectData?.kaynaklar?.personel || "64", icon: <UserOutlined /> },
  ];

  return (
    <Layout style={{ height: "100%", background: "#f8fafc" }}>
      {/* HEADER */}
      <Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #e5e7eb", display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        <Space direction="vertical" size={0}>
          <Text style={{ color: "#6b7280" }}>Kurumsal Proje Tanımları • WBS • Kaynak Yönetimi</Text>
        </Space>
        <Space>
          <Button icon={<CloseOutlined />} onClick={onClose}>Kapat</Button>
        </Space>
      </Header>

      <Content style={{ padding: 24, overflowY: "auto" }}>
        <Card style={{ borderRadius: 16 }} bodyStyle={{ paddingTop: 8 }}>
          <Tabs
            type="line"
            defaultActiveKey="project"
            items={[
              {
                key: "project",
                label: "Proje Bilgileri",
                children: (
                  <div style={{ marginTop: 12 }}>
                    {/* KPI Glass Cards */}
                    <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
                      {kpis.map((k) => (
                        <Col key={k.title} xs={24} sm={12} md={8} lg={4}>
                          <Card style={{ borderRadius: 16, border: "1px solid #eef2f7", boxShadow: "0 8px 20px rgba(17,24,39,0.05)" }} bodyStyle={{ padding: 14 }}>
                            <Text style={{ color: "#6b7280", fontSize: 12 }}>{k.title}</Text>
                            <Title level={4} style={{ margin: 0 }}>{k.value}</Title>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={{
                        projectCode: "PRJ00007",
                        projectName: "ANKARA ÇEVRE YOLU PROJESİ",
                        projectType: "Otoyol, Köprü ve Metro Yapıları",
                        firm: "ABC İnşaat",
                        location: "ÇEVRE YOLU PROJESİ",
                        costCenter: "BURSA MASRAF MERKEZİ",
                        manager: "Ahmet Demir",
                        estimate: 0
                      }}
                    >
                      <Row gutter={16}>
                        <Col span={6}>
                          <Form.Item label={<span><span style={{color: 'red'}}>*</span> Proje Kodu</span>} name="projectCode">
                            <Input placeholder="PRJ00007" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<span><span style={{color: 'red'}}>*</span> Proje Tanımı</span>} name="projectName">
                            <Input placeholder="Proje adını giriniz" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Proje Tipi" name="projectType">
                            <Select placeholder="Seçiniz" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Firma" name="firm">
                            <Select placeholder="Seçiniz" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={6}>
                          <Form.Item label="Lokasyon" name="location">
                            <Input placeholder="Lokasyon bilgisi" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Başlama Tarihi" name="startDate">
                            <DatePicker style={{ width: "100%" }} placeholder="Select date" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Bitiş Tarihi" name="endDate">
                            <DatePicker style={{ width: "100%" }} placeholder="Select date" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Masraf Merkezi" name="costCenter">
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={6}>
                          <Form.Item label="Proje Yöneticisi" name="manager">
                            <Select placeholder="Seçiniz" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Keşif Bedeli" name="estimate">
                            <InputNumber style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                )
              },
              { key: "isler", label: "İşler (4)", children: <IslerTab completion={completion} /> },
              { key: "machines", label: "İş Makineleri (1)", children: <MachinesTab /> },
              { key: "people", label: "Personeller (3)", children: <PeopleTab /> },
              { key: "materials", label: "Malzemeler (1)", children: <MaterialsTab /> },
              { key: "firms", label: "Firmalar (1)", children: <FirmsTab /> },
              { key: "contracts", label: "Sözleşmeler (1)", children: <ContractsTab /> },
              { key: "alarms", label: "Alarmlar (0)", children: <AlarmsTab /> },
              { key: "overtime", label: "Mesai Süreleri (0)", children: <OvertimeTab /> },
              { key: "attachments", label: "Ekli Belgeler (2)", children: <AttachmentsTab /> },
              { key: "images", label: "Resimler (0)", children: <ImagesTab /> },
              { key: "notes", label: "Açıklama", children: <NotesTab /> },
              { key: "custom", label: "Özel Alanlar (2)", children: <CustomFieldsTab /> },
            ]}
          />
        </Card>
      </Content>
    </Layout>
  );
}

// --- SEKME İÇERİKLERİ (VERİLERİYLE BİREBİR) ---

function IslerTab({ completion }) {
  const wbsData = [
    { key: "1", title: "01 • HAFRİYAT", weight: 100, planned: 0, actual: 0, level: 0, children: [
        { key: "1-1", title: "TST0101 / KAZI", weight: 30, planned: 8500, actual: 2500, unit: "M3" },
    ]},
    { key: "2", title: "02 • BETONARME", weight: 100, planned: 0, actual: 0, level: 0, children: [
        { key: "2-1", title: "TST0201 / SERME", weight: 25, planned: 12000, actual: 9000, unit: "M2" },
    ]}
  ];

  const columns = [
    { title: "İş Tanımı", dataIndex: "title", key: "title", render: (v, r) => (
      <Space><Text strong={r.level === 0}>{v}</Text>{r.level === 0 && <Tag color="blue">Kök</Tag>}</Space>
    )},
    { title: "Katsayı (%)", dataIndex: "weight", key: "weight", align: "right" },
    { title: "Miktar", dataIndex: "planned", key: "planned", align: "right", render: (v) => v || "-" },
    { title: "Gerçekleşen", dataIndex: "actual", key: "actual", align: "right", render: (v) => v || "-" },
    { title: "Birim", dataIndex: "unit", key: "unit" },
    { title: "Tamamlanma", key: "pct", render: (_, r) => <Progress percent={r.planned ? Math.round((r.actual/r.planned)*100) : completion} size="small" /> }
  ];

  return <Table columns={columns} dataSource={flattenTree(wbsData)} pagination={false} size="middle" />;
}

function MachinesTab() {
  const data = [{ key: 1, group: "Ekskavatör", code: "MKN00015", name: "HITACHI ZX8-2 MİNİ EKSKAVATÖR", type: "Mini Ekskavatör", brand: "HITACHI", qty: 1, unit: "Adet" }];
  return <Table columns={[{ title: "Makine", dataIndex: "name" }, { title: "Kod", dataIndex: "code" }, { title: "Durum", render: () => <Tag color="green">Aktif</Tag> }]} dataSource={data} pagination={false} />;
}

function PeopleTab() {
  const data = [
    { key: 1, name: "Kerim Yıldız", role: "Teknisyen", code: "PRS00013" },
    { key: 2, name: "Sezgin Sever", role: "Teknisyen", code: "PRS00006" }
  ];
  return <Table columns={[{ title: "Personel", dataIndex: "name" }, { title: "Rol", dataIndex: "role" }, { title: "Kod", dataIndex: "code" }]} dataSource={data} pagination={false} />;
}

function FirmsTab() {
  return (
    <Card style={{ borderRadius: 16, background: "rgba(255,255,255,0.75)" }}>
      <Space><Avatar icon={<UserOutlined />} /><Text strong>ABC İnşaat (Müşteri / Yüklenici)</Text></Space>
    </Card>
  );
}

function AttachmentsTab() {
  return <List bordered dataSource={["Sözleşme.pdf", "Metraj.xlsx"]} renderItem={item => <List.Item><FileTextOutlined /> {item}</List.Item>} />;
}

// Diğer boş/mock sekmeler için placeholderlar
const AlarmsTab = () => <Card><AlertOutlined /> Şimdilik alarm yok.</Card>;
const OvertimeTab = () => <Text>Haftalık 6 gün çalışma, günlük 10 saat.</Text>;
const MaterialsTab = () => <Text>Aydınlatma Malzemeleri (1 Adet)</Text>;
const ContractsTab = () => <Text>Ana Sözleşme (EPC)</Text>;
const ImagesTab = () => <Text>Görsel galerisi (Boş)</Text>;
const NotesTab = () => <Input.TextArea rows={4} placeholder="Proje notlarını yaz..." />;
const CustomFieldsTab = () => <Text>Özel Alan 1: Metin, Özel Alan 2: Seçim</Text>;