import React, { useMemo, useState } from "react";
import {
  Layout,
  Typography,
  Menu,
  message,
  Space,
  Avatar,
  Button,
  Input,
  Divider,
  Card,
  Tag,
  Progress,
  Badge,
  Dropdown,
  Row,
  Col,
  Form,
  DatePicker,
  InputNumber,
  Select,
  Tabs,
  Drawer,
  List,
  Table,
  Upload,
  Statistic,
} from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  SettingOutlined,
  PlusOutlined,
  LinkOutlined,
  FileTextOutlined,
  PictureOutlined,
  UserOutlined,
  ToolOutlined,
  ApartmentOutlined,
  DollarOutlined,
  SearchOutlined,
  HistoryOutlined,
  ProjectOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// -----------------------------
// Mock Veri Hazırlığı
// -----------------------------
const wbsData = [
  {
    key: "1",
    title: "MOBİLİZASYON",
    weight: 10,
    planned: 100,
    actual: 80,
    unit: "%",
    children: [
      { key: "1.1", title: "Şantiye Kurulumu", weight: 5, planned: 100, actual: 100, unit: "%" },
      { key: "1.2", title: "Makine Sevkiyatı", weight: 5, planned: 100, actual: 60, unit: "%" },
    ],
  },
  {
    key: "2",
    title: "HAFRİYAT VE KAZI",
    weight: 30,
    planned: 10000,
    actual: 4500,
    unit: "m3",
    children: [
      { key: "2.1", title: "Yol Kazısı", weight: 20, planned: 7000, actual: 4000, unit: "m3" },
      { key: "2.2", title: "Dolgu İşleri", weight: 10, planned: 3000, actual: 500, unit: "m3" },
    ],
  },
];

export default function AntDProjectDefinitions() {
  const [form] = Form.useForm();
  
  // KPI Hesaplamaları (Demo)
  const kpis = [
    { title: "Tamamlanma", value: 65, suffix: "%", icon: <DashboardOutlined />, color: "#52c41a" },
    { title: "Toplam Bütçe", value: 3.2, suffix: "M $", icon: <DollarOutlined />, color: "#1890ff" },
    { title: "Aktif Ekipman", value: 12, suffix: "Adet", icon: <ToolOutlined />, color: "#faad14" },
    { title: "Personel Gücü", value: 142, suffix: "Kişi", icon: <UserOutlined />, color: "#722ed1" },
  ];

  const columns = [
    {
      title: "İş Tanımı / WBS",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space>
          {record.children ? <ApartmentOutlined style={{ color: '#1890ff' }} /> : <FileTextOutlined />}
          <Text strong={!!record.children}>{text}</Text>
        </Space>
      ),
    },
    { title: "Katsayı (%)", dataIndex: "weight", key: "weight", width: 120, align: "center" },
    { title: "Planlanan", dataIndex: "planned", key: "planned", width: 120, align: "right" },
    { title: "Gerçekleşen", dataIndex: "actual", key: "actual", width: 120, align: "right" },
    { title: "Birim", dataIndex: "unit", key: "unit", width: 80, align: "center" },
    {
      title: "İlerleme",
      key: "progress",
      width: 200,
      render: (_, r) => (
        <Progress 
          percent={Math.round((r.actual / r.planned) * 100)} 
          size="small" 
          strokeColor={r.children ? "#1890ff" : "#52c41a"}
        />
      ),
    },
  ];

  return (
    <Layout style={{ height: "100vh", background: "#f0f2f5" }}>
      
      {/* 1. SABİT HEADER */}
      <Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #d9d9d9", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space direction="vertical" size={0}>
          <Title level={4} style={{ margin: 0 }}>Ankara Çevre Yolu Projesi</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>PRJ00007 • ABC İnşaat • Altyapı Projesi</Text>
        </Space>
        <Space>
          <Button icon={<HistoryOutlined />}>Loglar</Button>
          <Button type="primary" icon={<SaveOutlined />}>Değişiklikleri Kaydet</Button>
          <Button icon={<CloseOutlined />} danger ghost>Kapat</Button>
        </Space>
      </Header>

      {/* 2. SCROLLABLE İÇERİK */}
      <Content style={{ padding: 20, overflowY: "auto" }}>
        
        {/* KPI Row */}
        
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          {kpis.map((k, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card bordered={false} style={{ borderRadius: 12 }}>
                <Statistic 
                  title={<Text type="secondary" style={{ fontSize: 12 }}>{k.title.toUpperCase()}</Text>}
                  value={k.value}
                  suffix={k.suffix}
                  prefix={k.icon}
                  valueStyle={{ color: k.color, fontWeight: 700 }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Tab Yapısı */}
        <Card bordered={false} style={{ borderRadius: 16 }}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: <Space><ProjectOutlined />Proje Bilgileri</Space>,
                children: (
                  <Form layout="vertical" form={form}>
                    <Row gutter={24}>
                      <Col span={6}><Form.Item label="Proje Kodu"><Input defaultValue="PRJ00007" disabled /></Form.Item></Col>
                      <Col span={12}><Form.Item label="Proje Tanımı"><Input defaultValue="ANKARA ÇEVRE YOLU PROJESİ" /></Form.Item></Col>
                      <Col span={6}>
                        <Form.Item label="Durum">
                          <Select defaultValue="ACIK">
                            <Select.Option value="ACIK">Açık / Devam Ediyor</Select.Option>
                            <Select.Option value="ASKI">Askıda</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={6}><Form.Item label="Başlangıç Tarihi"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                      <Col span={6}><Form.Item label="Bitiş Tarihi"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                      <Col span={6}><Form.Item label="Proje Yöneticisi"><Input defaultValue="Ahmet Demir" /></Form.Item></Col>
                      <Col span={6}><Form.Item label="Masraf Merkezi"><Input defaultValue="MM-001-ANK" /></Form.Item></Col>
                    </Row>
                  </Form>
                ),
              },
              {
                key: "2",
                label: <Space><ApartmentOutlined />İşler (WBS)</Space>,
                children: (
                  <div style={{ padding: '0 8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <Input prefix={<SearchOutlined />} placeholder="İş kalemlerinde ara..." style={{ width: 300 }} />
                      <Space>
                        <Button>Excel Taslak İndir</Button>
                        <Button type="primary" icon={<PlusOutlined />}>İş Kalemi Ekle</Button>
                      </Space>
                    </div>
                    <Table 
                      columns={columns} 
                      dataSource={wbsData} 
                      pagination={false} 
                      expandable={{ defaultExpandAllRows: true }}
                    />
                  </div>
                ),
              },
              {
                key: "3",
                label: <Space><ToolOutlined />İş Makineleri</Space>,
                children: (
                    <Table 
                        size="small"
                        dataSource={[{ key: 1, code: 'MKN-001', name: 'Ekskavatör CAT 320', status: 'Sahrada' }]}
                        columns={[
                            { title: 'Kod', dataIndex: 'code' },
                            { title: 'Makine Adı', dataIndex: 'name' },
                            { title: 'Durum', dataIndex: 'status', render: (s) => <Tag color="green">{s}</Tag> }
                        ]}
                    />
                )
              },
              {
                key: "4",
                label: <Space><FileTextOutlined />Belgeler</Space>,
                children: (
                    <Upload.Dragger>
                        <p className="ant-upload-drag-icon"><FileTextOutlined /></p>
                        <p className="ant-upload-text">Dosyaları buraya sürükleyin</p>
                    </Upload.Dragger>
                )
              }
            ]}
          />
        </Card>
      </Content>
    </Layout>
  );
}

// Dummy Icon mapping (Eksik olanlar için)
const DashboardOutlined = ApartmentOutlined;