import React, { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Button,
  Tag,
  Progress,
  Table,
  Drawer,
  Menu,
  Modal,
  Segmented,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  ProjectOutlined,
  DashboardOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  VideoCameraOutlined,
  SearchOutlined,
  AppstoreOutlined,
  BarsOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// -----------------------------
// Mock Data (Önceki projenle uyumlu)
// -----------------------------
const PROJECTS_DATA = [
  {
    id: "PRJ-001",
    code: "DRC HAVA ALANI",
    location: "DRC / Bölge-1",
    status: "Aktif",
    progress: 42,
    budget: 3200000,
    actual: 1450000,
    currency: "USD",
    machineCount: 38,
    personnelCount: 126,
    start: "01.03.2025",
    end: "05.03.2026",
  },
  {
    id: "PRJ-118",
    code: "İSTANBUL ATIK SU",
    location: "İstanbul, TR",
    status: "Aktif",
    progress: 65,
    budget: 2100000,
    actual: 1680000,
    currency: "EUR",
    machineCount: 52,
    personnelCount: 214,
    start: "01.09.2025",
    end: "15.06.2026",
  },
  {
    id: "PRJ-044",
    code: "BURSA KAVŞAK",
    location: "Bursa, TR",
    status: "Riskte",
    progress: 88,
    budget: 980000,
    actual: 1020000,
    currency: "USD",
    machineCount: 21,
    personnelCount: 78,
    start: "12.05.2025",
    end: "28.02.2026",
  },
];

const SECTIONS = [
  { key: "İşler", label: "İş Emirleri", icon: <DashboardOutlined /> },
  { key: "Gelir", label: "Proje Gelirleri", icon: <DollarOutlined /> },
  { key: "Makineler", label: "Makineler", icon: <ProjectOutlined /> },
  { key: "Kameralar", label: "Kameralar", icon: <VideoCameraOutlined /> },
];

export default function AntDProjectManagement() {
  const [view, setView] = useState("Kutular");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeMenu, setActiveMenu] = useState("İşler");
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Bütçe formatlayıcı
  const money = (val, cur) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(val);

  // Tablo Kolonları
  const columns = [
    { title: "Proje Kodu", dataIndex: "code", key: "code", render: (t) => <Text strong>{t}</Text> },
    { title: "Lokasyon", dataIndex: "location", key: "location" },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={s === "Aktif" ? "success" : "error"}>{s}</Tag>
      ),
    },
    {
      title: "İlerleme",
      dataIndex: "progress",
      key: "progress",
      render: (p) => <Progress percent={p} size="small" />,
    },
    {
      title: "Bütçe",
      key: "budget",
      render: (_, r) => money(r.budget, r.currency),
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, r) => (
        <Button size="small" onClick={() => setSelectedProject(r)}>Detay</Button>
      ),
    },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f7f9" }}>
      
      {/* 1. SABİT HEADER */}
      <div style={{ background: "#fff", padding: "16px 24px", borderBottom: "1px solid #d9d9d9", zIndex: 10 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>Proje Yönetimi</Title>
          </Col>
          <Col>
            <Segmented
              options={[
                { label: "Kutular", value: "Kutular", icon: <AppstoreOutlined /> },
                { label: "Liste", value: "Liste", icon: <BarsOutlined /> },
              ]}
              value={view}
              onChange={setView}
            />
          </Col>
        </Row>
      </div>

      {/* 2. SCROLLABLE İÇERİK ALANI */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        
        {/* KPI Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: "4px solid #52c41a" }}>
              <Statistic title="Aktif Projeler" value={12} prefix={<ProjectOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: "4px solid #1890ff" }}>
              <Statistic title="Toplam Bütçe" value={8.4} precision={1} suffix="M $" prefix={<DollarOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: "4px solid #faad14" }}>
              <Statistic title="Ort. İlerleme" value={54} suffix="%" prefix={<DashboardOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: "4px solid #ff4d4f" }}>
              <Statistic title="Riskli Projeler" value={2} prefix={<SafetyCertificateOutlined />} />
            </Card>
          </Col>
        </Row>

        {/* Filtre Barı */}
        <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row gutter={16}>
            <Col flex="auto">
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Proje adı, müşteri veya kod ara..." 
                allowClear
                onChange={e => setSearchText(e.target.value)}
              />
            </Col>
            <Col span={4}>
              <Select placeholder="Durum Seç" style={{ width: "100%" }}>
                <Select.Option value="Aktif">Aktif</Select.Option>
                <Select.Option value="Riskte">Riskte</Select.Option>
              </Select>
            </Col>
            <Col>
              <Button type="primary">Filtrele</Button>
            </Col>
          </Row>
        </Card>

        {/* Proje Görünümü */}
        {view === "Kutular" ? (
          <Row gutter={[16, 16]}>
            {PROJECTS_DATA.map((p) => (
              <Col xs={24} sm={12} lg={8} key={p.id}>
                <Card
                  hoverable
                  actions={[
                    <VideoCameraOutlined key="cam" onClick={(e) => { e.stopPropagation(); setCameraModalVisible(true); }} />,
                    <ProjectOutlined key="detail" onClick={() => setSelectedProject(p)} />,
                  ]}
                  style={{ borderRadius: 16, overflow: "hidden" }}
                >
                  <Card.Meta
                    title={<div style={{ display: 'flex', justifyContent: 'space-between' }}>{p.code} <Tag color={p.status === "Aktif" ? "green" : "red"}>{p.status}</Tag></div>}
                    description={<span><EnvironmentOutlined /> {p.location}</span>}
                    style={{ marginBottom: 16 }}
                  />
                  <div style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text type="secondary">İlerleme</Text>
                      <Text strong>{p.progress}%</Text>
                    </div>
                    <Progress percent={p.progress} strokeColor={p.status === "Riskte" ? "#ff4d4f" : "#1890ff"} />
                  </div>
                  <Divider dashed style={{ margin: "16px 0" }} />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic title="Bütçe" value={p.budget} valueStyle={{ fontSize: 14 }} suffix={p.currency} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="Gerçekleşen" value={p.actual} valueStyle={{ fontSize: 14, color: p.actual > p.budget ? '#cf1322' : '#3f8600' }} suffix={p.currency} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Table dataSource={PROJECTS_DATA} columns={columns} pagination={false} rowKey="id" />
        )}
      </div>

      {/* 3. PROJE DETAY DRAWER */}
      <Drawer
        title={selectedProject ? `${selectedProject.code} - Detay Yönetimi` : ""}
        placement="right"
        width={1000}
        onClose={() => setSelectedProject(null)}
        open={!!selectedProject}
        extra={
          <Space>
            <Button icon={<CalendarOutlined />}>Takvim</Button>
            <Button type="primary" icon={<CloseOutlined />} onClick={() => setSelectedProject(null)} danger />
          </Space>
        }
      >
        <Row gutter={24}>
          <Col span={6}>
            <Menu
              mode="inline"
              selectedKeys={[activeMenu]}
              onClick={(e) => setActiveMenu(e.key)}
              items={SECTIONS}
              style={{ borderRight: 0 }}
            />
          </Col>
          <Col span={18}>
            <Title level={5}>{activeMenu} İçeriği</Title>
            <div style={{ padding: 40, border: "2px dashed #d9d9d9", borderRadius: 12, textAlign: "center", background: "#fafafa" }}>
              <Text type="secondary">{selectedProject?.code} projesi için {activeMenu} modülü yükleniyor...</Text>
            </div>
          </Col>
        </Row>
      </Drawer>

      {/* 4. KAMERA POPUP (MODAL) */}
      <Modal
        title="Canlı Saha Kameraları"
        open={cameraModalVisible}
        onCancel={() => setCameraModalVisible(false)}
        footer={null}
        width={900}
        centered
      >
        <Row gutter={16}>
          <Col span={18}>
            <div style={{ width: "100%", aspectVideo: "16/9", background: "#000", borderRadius: 8, display: 'grid', placeItems: 'center' }}>
              <Text style={{ color: "#fff" }}>[ CANLI YAYIN: GİRİŞ KAPISI ]</Text>
            </div>
          </Col>
          <Col span={6}>
            <Menu
              style={{ borderRadius: 8 }}
              defaultSelectedKeys={['1']}
              items={[
                { key: '1', icon: <VideoCameraOutlined />, label: 'Kamera 01' },
                { key: '2', icon: <VideoCameraOutlined />, label: 'Kamera 02' },
                { key: '3', icon: <VideoCameraOutlined />, label: 'Kamera 03' },
              ]}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}