import React, { useState, useMemo } from "react";
import {
  Card, Row, Col, Statistic, Input, Select, Button, Tag, Progress, 
  Table, Drawer, Menu, Modal, Segmented, Space, Typography, Divider, Tooltip
} from "antd";
import {
  ProjectOutlined, DashboardOutlined, DollarOutlined, SafetyCertificateOutlined,
  VideoCameraOutlined, SearchOutlined, AppstoreOutlined, BarsOutlined,
  EnvironmentOutlined, UserOutlined, CloseOutlined, TeamOutlined, 
  ToolOutlined, PlusOutlined, DownloadOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

// -----------------------------
// Mock Data (Zenginleştirilmiş)
// -----------------------------
const PROJECTS_DATA = [
  {
    id: "PRJ-001",
    code: "DRC HAVA ALANI",
    name: "Havalimanı Proje İnşaatı",
    location: "DRC / Bölge-1",
    customer: "ORE Mining",
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
    name: "İstanbul Anadolu Atık Su Kanalı",
    location: "İstanbul, TR",
    customer: "Rönesans İnşaat",
    status: "Aktif",
    progress: 65,
    budget: 2100000,
    actual: 2680000, // Sapma örneği için bütçe üstü
    currency: "EUR",
    machineCount: 52,
    personnelCount: 214,
    start: "01.09.2025",
    end: "15.06.2026",
  },
  {
    id: "PRJ-044",
    code: "BURSA KAVŞAK",
    name: "Bursa Köprülü Kavşak Projesi",
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
  { key: "İşler", label: "İş Emirleri / WBS" },
  { key: "Gelir", label: "Proje Gelirleri" },
  { key: "Gider", label: "Proje Giderleri" },
  { key: "Makineler", label: "Ekipman Listesi" },
  { key: "Malzemeler", label: "Malzeme Listesi" },
  { key: "Personel", label: "Personel" },
  { key: "Akaryakıt", label: "Akaryakıt" },
  { key: "Bakım Arıza", label: "Bakım Arıza" },
  { key: "Lastik İşlemleri", label: "Lastik İşlemleri" },
  { key: "Belgeler", label: "Belgeler" },
  { key: "Kameralar", label: "Kameralar" },
];

export default function OmegaProjectManagement() {
  const [view, setView] = useState("Kutular");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeMenu, setActiveMenu] = useState("İşler");
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const money = (val, cur) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      
      {/* 1. HEADER BAR */}
      <div style={{ background: "#fff", padding: "16px 24px", borderBottom: "1px solid #e5e7eb", zIndex: 10 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>Proje Yönetimi</Title>
          </Col>
          <Col>
            <Space size="middle">
              <Segmented
                options={[
                  { label: "Kutular", value: "Kutular", icon: <AppstoreOutlined /> },
                  { label: "Liste", value: "Liste", icon: <BarsOutlined /> },
                ]}
                value={view}
                onChange={setView}
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* 2. İÇERİK ALANI */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        
        {/* KPI Özetleri */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: "5px solid #52c41a", borderRadius: 12 }}>
              <Statistic title="Aktif Projeler" value={12} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: "5px solid #1890ff", borderRadius: 12 }}>
              <Statistic title="Toplam Bütçe" value={8.4} suffix="M $" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: "5px solid #faad14", borderRadius: 12 }}>
              <Statistic title="Ort. İlerleme" value={54} suffix="%" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: "5px solid #ff4d4f", borderRadius: 12 }}>
              <Statistic title="Riskli Projeler" value={2} />
            </Card>
          </Col>
        </Row>

        {/* Proje Görünümü */}
        {view === "Kutular" ? (
          <Row gutter={[20, 20]}>
            {PROJECTS_DATA.map((p) => {
              const variance = p.actual - p.budget;
              const variancePct = p.budget ? Math.round((variance / p.budget) * 100) : 0;

              return (
                <Col xs={24} md={12} xl={8} key={p.id}>
                  <Card
                    hoverable
                    className="border-none shadow-sm transition-all"
                    style={{ borderRadius: 24, position: 'relative', overflow: 'hidden' }}
                    bodyStyle={{ padding: '24px' }}
                    onClick={() => setSelectedProject(p)}
                  >
                    {/* SAĞ ÜST: KAMERA BUTONU */}
                    <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                      <Button 
                        icon={<VideoCameraOutlined />} 
                        className="h-10 w-10 border-black/5 bg-white shadow-sm flex items-center justify-center"
                        style={{ borderRadius: 12 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCameraModalVisible(true);
                        }}
                      />
                    </div>

                    {/* ÜST BİLGİ */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 24, paddingRight: 40 }}>
                      <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ProjectOutlined style={{ fontSize: 20, color: '#374151' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <Text strong style={{ fontSize: 16, display: 'block' }} className="truncate">{p.code}</Text>
                        <Text type="secondary" style={{ fontSize: 13 }} className="truncate">
                          <EnvironmentOutlined /> {p.location}
                        </Text>
                      </div>
                    </div>

                    {/* İLERLEME */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 13, color: '#6b7280' }}>İlerleme</Text>
                        <Text strong style={{ fontSize: 14 }}>{p.progress}%</Text>
                      </div>
                      <Progress 
                        percent={p.progress} 
                        showInfo={false} 
                        strokeWidth={8}
                        strokeColor={p.status === "Riskte" ? "#f43f5e" : "#10b981"}
                      />
                    </div>

                    {/* BÜTÇE KUTULARI */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div style={{ background: '#f8fafb', padding: '12px', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                        <Text type="secondary" style={{ fontSize: 10, fontWeight: 'bold', display: 'block' }}>BÜTÇE</Text>
                        <Text strong style={{ fontSize: 14 }}>{money(p.budget, p.currency)}</Text>
                      </div>
                      <div style={{ background: '#f8fafb', padding: '12px', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                        <Text type="secondary" style={{ fontSize: 10, fontWeight: 'bold', display: 'block' }}>GERÇEKLEŞEN</Text>
                        <Text strong style={{ fontSize: 14 }}>{money(p.actual, p.currency)}</Text>
                      </div>
                    </div>

                    {/* SAPMA VE TARİH */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>Sapma</Text>
                        <Text strong style={{ color: variance > 0 ? "#f43f5e" : "#10b981", fontSize: 13 }}>
                          {variance > 0 ? "+" : ""}{money(variance, p.currency)} ({variancePct}%)
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>Tarih</Text>
                        <Text strong style={{ fontSize: 13 }}>{p.start} → {p.end}</Text>
                      </div>
                    </div>

                    <Divider style={{ margin: '16px 0' }} dashed />

                    {/* ALT BİLGİ */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space size="middle">
                        <span style={{ fontSize: 12, color: '#6b7280' }}><ToolOutlined /> Makine: <Text strong>{p.machineCount}</Text></span>
                        <span style={{ fontSize: 12, color: '#6b7280' }}><TeamOutlined /> Personel: <Text strong>{p.personnelCount}</Text></span>
                      </Space>
                      <Tag bordered={false} color={p.status === "Aktif" ? "success" : "error"} style={{ borderRadius: 8, fontWeight: 'bold' }}>
                        {p.status.toUpperCase()}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden' }}>
            <Table 
              dataSource={PROJECTS_DATA} 
              columns={[
                { title: 'Proje', dataIndex: 'code', key: 'code', render: (t) => <Text strong>{t}</Text> },
                { title: 'İlerleme', dataIndex: 'progress', render: (p) => <Progress percent={p} size="small" /> },
                { title: 'Bütçe', dataIndex: 'budget', render: (v, r) => money(v, r.currency) },
                { title: 'Durum', dataIndex: 'status', render: (s) => <Tag color={s === "Aktif" ? "success" : "error"}>{s}</Tag> },
                { title: 'İşlem', key: 'op', render: (_, r) => <Button size="small" onClick={() => setSelectedProject(r)}>Detay</Button> }
              ]} 
              pagination={false} 
            />
          </Card>
        )}
      </div>

      {/* 3. PROJE DETAY DRAWER */}
      <Drawer
        title={selectedProject ? `${selectedProject.code} - Detay Yönetimi` : ""}
        width="min(95vw, 1100px)"
        onClose={() => setSelectedProject(null)}
        open={!!selectedProject}
        extra={<Button icon={<CloseOutlined />} onClick={() => setSelectedProject(null)} type="text" />}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ width: 220, borderRight: '1px solid #f0f0f0', paddingRight: 16 }}>
            <Menu
              mode="inline"
              selectedKeys={[activeMenu]}
              onClick={(e) => setActiveMenu(e.key)}
              items={SECTIONS}
              style={{ border: 'none' }}
            />
          </div>
          <div style={{ flex: 1, paddingLeft: 24 }}>
             <Title level={4}>{activeMenu} Modülü</Title>
             <div style={{ padding: 40, border: '2px dashed #f0f0f0', borderRadius: 16, textAlign: 'center' }}>
                <Text type="secondary">{activeMenu} içeriği burada yüklenecek.</Text>
             </div>
          </div>
        </div>
      </Drawer>

      {/* 4. KAMERA MODAL */}
      <Modal
        title="Canlı Saha Kameraları"
        open={cameraModalVisible}
        onCancel={() => setCameraModalVisible(false)}
        footer={null}
        width={1000}
        centered
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: 'flex', height: 550, background: '#000' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff' }}>[ CANLI YAYIN SİNYALİ ]</Text>
          </div>
          <div style={{ width: 240, background: '#141414', borderLeft: '1px solid #333' }}>
            <div style={{ padding: '16px', color: '#fff', borderBottom: '1px solid #333' }}>Kamera Listesi</div>
            <Menu
              theme="dark"
              mode="inline"
              items={[
                { key: '1', label: 'Ana Giriş Kapısı', icon: <VideoCameraOutlined /> },
                { key: '2', label: 'Malzeme Sahası', icon: <VideoCameraOutlined /> },
                { key: '3', label: 'Bakım Atölyesi', icon: <VideoCameraOutlined /> },
              ]}
              defaultSelectedKeys={['1']}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}